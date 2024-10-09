export interface ChildInterface {
id:number,
title:string,
node_id:number,
parent_node_id:number,
ordering:number,
childObjs:ChildInterface[];
}

export interface ChildComponentProps extends ChildInterface {
    updateChildData: (
      childId: number,
      updatedChild: ChildInterface | null
    ) => void;
    handleDrag: (e: React.DragEvent, index: number) => void; 
    handleDrop: (e: React.DragEvent, dropIndex: number, hierarchical_level:number) => void;  
  }