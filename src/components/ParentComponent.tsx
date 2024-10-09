import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { ChildInterface } from "../interfaces/Interfaces";
import ChildComponent from "./ChildComponent";
import EditableInput from "./EditableInput";

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

  const [trigger, setTrigger] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpdateChildData = (
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
  };

  const addNewChild = () => {
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
  };

  const handleDrag = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (draggedIndex === null) return;

    if (
      parentInfo.childObjs[dropIndex].node_id ==
      parentInfo.childObjs[draggedIndex].node_id
    ) {
      const updatedChildren = [...parentInfo.childObjs];

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

      setParentInfo({
        ...parentInfo,
        childObjs: updatedChildren,
      });

      setDraggedIndex(null);
    }
    setTrigger(!trigger);
  };

  useEffect(() => {
    trigger == false ? setTrigger(!trigger) : null;
  }, [trigger]);

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
          {parentInfo.childObjs.length > 0 && parentInfo.childObjs && trigger
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
                      node_id={child.parent_node_id + 1}
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

export default ParentComponent;
