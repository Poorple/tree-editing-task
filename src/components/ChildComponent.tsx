import { useEffect, useState } from "react";
import { ChildComponentProps, ChildInterface } from "../interfaces/Interfaces";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
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

  useEffect(() => {
    updateChildData(currentInfo.id, currentInfo);
  }, [currentInfo]);

  function handleDataFromChild(data: string) {
    const updatedInfo = { ...currentInfo, title: data };
    setCurrentInfo(updatedInfo);
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

    setCurrentInfo((prev) => ({
      ...prev,
      childObjs: [...prev.childObjs, newChild],
    }));
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

    setCurrentInfo((prevInfo) => ({
      ...prevInfo,
      childObjs: updatedChildren,
    }));
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    handleDrag(e, ordering);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    if (
      draggedIndex === null ||
      dropIndex < 0 ||
      dropIndex >= currentInfo.childObjs.length
    )
      return;

    const updatedChildren = [...currentInfo.childObjs];

    const draggedItem = updatedChildren[draggedIndex];
    const droppedItem = updatedChildren[dropIndex];

    updatedChildren[draggedIndex] = droppedItem;
    updatedChildren[dropIndex] = draggedItem;

    updatedChildren.forEach((child, idx) => (child.ordering = idx));

    setCurrentInfo((prevInfo) => ({
      ...prevInfo,
      childObjs: updatedChildren,
    }));

    setDraggedIndex(null);
    handleDrop(e, ordering);
  };

  return (
    <ul>
      <li
        draggable
        onDragStart={(e) => onDragStart(e, ordering)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, ordering)}
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
      {isOpen && currentInfo.childObjs && (
        <>
          {currentInfo.childObjs.map((child, i) => (
            <li
              draggable
              key={child.id}
              onDragStart={(e) => onDragStart(e, i)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, i)}
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
          <li className="newChildBtn">
            <button onClick={addNewChild}>
              <CiCirclePlus />
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default ChildComponent;
