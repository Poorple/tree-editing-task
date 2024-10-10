import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { ChildInterface, PATH } from "../interfaces/Interfaces";
import ChildComponent from "./ChildComponent";
import EditableInput from "./EditableInput";
import axios from "axios";

const ParentComponent = () => {
  const [parentInfo, setParentInfo] = useState<ChildInterface>({
    id: 0,
    title: "Parent",
    node_id: 0,
    parent_node_id: 0,
    ordering: 0,
    childObjs: [],
  });

  function handleDataFromChild(data: string) {
    setParentInfo((prevChildInfo) => ({ ...prevChildInfo, title: data }));
  }

  const [isOpen, setIsOpen] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(PATH);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setParentInfo((prevParentInfo) => ({
            ...prevParentInfo,
            childObjs: response.data,
          }));
        }
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleUpdateChildData = async (
    childId: number,
    updatedChild: ChildInterface | null
  ) => {
    const updatedChildren = updatedChild
      ? parentInfo.childObjs.map((child) =>
          child.id === childId ? updatedChild : child
        )
      : parentInfo.childObjs.filter((child) => child.id !== childId);

    setParentInfo((prevInfo) => ({
      ...prevInfo,
      childObjs: updatedChildren,
    }));
    try {
      if (updatedChild) {
        await axios.put(`${PATH}/${childId}`, updatedChild);
        console.log("Parent info updated successfully");
      }
    } catch (error) {
      console.error("Error updating parent info", error);
    }
  };

  const addNewChild = async () => {
    const newChild: ChildInterface = {
      id: Date.now(),
      title: `child${parentInfo.childObjs.length + 1}`,
      node_id: parentInfo.parent_node_id + 1,
      parent_node_id: parentInfo.parent_node_id,
      ordering: parentInfo.childObjs.length,
      childObjs: [],
    };

    setParentInfo((prevChildInfo) => ({
      ...prevChildInfo,
      childObjs: [...prevChildInfo.childObjs, newChild],
    }));

    console.log(newChild);
    try {
      await axios.post(`${PATH}`, newChild);
      console.log("New child added successfully");
    } catch (error) {
      console.error("Error adding child", error);
    }
  };

  const handleDrag = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updatedChildren = [...parentInfo.childObjs];
    const draggedItem = updatedChildren[draggedIndex];
    const droppedItem = updatedChildren[dropIndex];

    // Remove the dragged item and insert it at the drop index
    updatedChildren.splice(draggedIndex, 1);
    updatedChildren.splice(dropIndex, 0, draggedItem);

    // Update ordering
    updatedChildren.forEach((child, idx) => {
      child.ordering = idx;
    });
    const temp = draggedItem.childObjs;
    draggedItem.childObjs = droppedItem.childObjs;
    droppedItem.childObjs = temp;

    updatedChildren.forEach((child, idx) => {
      child.ordering = idx;
    });

    setParentInfo((prevParentInfo) => ({
      ...prevParentInfo,
      childObjs: updatedChildren,
    }));

    setDraggedIndex(null);

    try {
      await axios.put(`${PATH}/${parentInfo.id}`, {
        childObjs: updatedChildren,
      });
      console.log("Child reordered successfully");
    } catch (error) {
      console.error("Error reordering child", error);
    }
  };

  return (
    <ul className="parent">
      <li>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        <EditableInput
          initInput={parentInfo.title}
          dataToParent={handleDataFromChild}
        />
      </li>
      {isOpen ? (
        <>
          {parentInfo?.childObjs.length > 0 && parentInfo.childObjs
            ? parentInfo.childObjs.map((child, i) => {
                return (
                  <li
                    draggable
                    key={child.id}
                    onDragStart={(e) => handleDrag(e, i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, i)}
                  >
                    <ChildComponent
                      id={child.id}
                      title={child.title}
                      parent_node_id={parentInfo.node_id}
                      node_id={child.node_id}
                      ordering={i}
                      childObjs={child.childObjs}
                      updateChildData={handleUpdateChildData}
                      handleDrag={handleDrag}
                      handleDrop={handleDrop}
                    />
                  </li>
                );
              })
            : null}
          <li className="newChildBtn">
            <button onClick={addNewChild}>
              <CiCirclePlus />
            </button>
          </li>
        </>
      ) : null}
    </ul>
  );
};

export default ParentComponent;
