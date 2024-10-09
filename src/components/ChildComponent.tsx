import { useEffect, useState } from "react";
import { ChildComponentProps, ChildInterface } from "../interfaces/Interfaces";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import "../styles/childComponents.scss";
import EditableInput from "./EditableInput";

const ChildComponent = ({
  id,
  title,
  parent_node_id,
  childObjs,
  updateChildData,
  ordering,
  handleDrag,
  handleDrop,
}: ChildComponentProps) => {
  const [currentInfo, setCurrentInfo] = useState<ChildInterface>({
    id: id || Date.now(),
    title: title || "",
    node_id: parent_node_id + 1,
    parent_node_id: parent_node_id,
    ordering: ordering,
    childObjs: childObjs || [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [trigger, setTrigger] = useState(false);

  function handleDataFromChild(data: string) {
    const updatedInfo = { ...currentInfo, title: data };
    setCurrentInfo(updatedInfo);
    updateChildData(currentInfo.id, updatedInfo);
  }

  const addNewChild = () => {
    const newChild: ChildInterface = {
      id: Date.now(),
      title: `child${currentInfo.childObjs.length + 1}`,
      node_id: currentInfo.parent_node_id + 1,
      parent_node_id: currentInfo.parent_node_id + 1,
      ordering: currentInfo.childObjs.length,
      childObjs: [],
    };

    const updatedInfo = {
      ...currentInfo,
      childObjs: [...currentInfo.childObjs, newChild],
    };

    setCurrentInfo(updatedInfo);
    updateChildData(currentInfo.id, updatedInfo);
  };

  const deleteObj = () => {
    updateChildData(currentInfo.id, null);
  };

  const handleUpdateChildData: typeof updateChildData = (
    childId,
    updatedChild
  ) => {
    const updatedChildren = updatedChild
      ? currentInfo.childObjs.map((child) =>
          child.id === childId ? updatedChild : child
        )
      : currentInfo.childObjs.filter((child) => child.id !== childId);

    const updatedInfo = { ...currentInfo, childObjs: updatedChildren };

    setCurrentInfo(updatedInfo);
    updateChildData(currentInfo.id, updatedInfo);
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    handleDrag(e, ordering);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (
    e: React.DragEvent,
    dropIndex: number,
    hierarchical_level: number
  ) => {
    if (draggedIndex === null) return;

    if (childObjs[dropIndex].node_id == childObjs[draggedIndex].node_id) {
      const updatedChildren = [...currentInfo.childObjs];

      const draggedItem = { ...updatedChildren[draggedIndex] };

      const droppedItem = { ...updatedChildren[dropIndex] };

      console.log(draggedItem);
      console.log(droppedItem);

      const temp = [...draggedItem.childObjs];

      console.log(temp);

      draggedItem.childObjs = droppedItem.childObjs;
      droppedItem.childObjs = temp;
      updatedChildren[draggedIndex] = droppedItem;
      updatedChildren[dropIndex] = draggedItem;

      updatedChildren.forEach((child, idx) => (child.ordering = idx));

      setCurrentInfo({
        ...currentInfo,
        childObjs: updatedChildren,
      });

      updateChildData(currentInfo.id, {
        ...currentInfo,
        childObjs: updatedChildren,
      });

      setDraggedIndex(null);
      handleDrop(e, ordering, hierarchical_level);
    }
    setTrigger(!trigger);
  };

  useEffect(() => {
    trigger == false ? setTrigger(!trigger) : null;
  }, [trigger]);

  return (
    <ul>
      <li
        draggable
        onDragStart={(e) => onDragStart(e, ordering)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, ordering, parent_node_id + 1)}
      >
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        <EditableInput
          initInput={currentInfo.title}
          dataToParent={handleDataFromChild}
        />
        <button onClick={deleteObj}>
          <MdDeleteForever />
        </button>
      </li>
      {isOpen && currentInfo && trigger ? (
        <>
          {currentInfo.childObjs.length > 0 &&
            currentInfo.childObjs.map((child, i) => (
              <li
                draggable
                key={child.id}
                onDragStart={(e) => onDragStart(e, i)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, i, currentInfo.node_id)}
              >
                <ChildComponent
                  id={child.id}
                  title={child.title}
                  parent_node_id={currentInfo.node_id}
                  node_id={child.parent_node_id + 1}
                  childObjs={child.childObjs}
                  ordering={i}
                  updateChildData={handleUpdateChildData}
                  handleDrag={onDragStart}
                  handleDrop={onDrop}
                />
              </li>
            ))}
          <li>
            <button className="newClass" onClick={addNewChild}>
              <CiCirclePlus />
            </button>
          </li>
        </>
      ) : null}
    </ul>
  );
};

export default ChildComponent;
