import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";
import type { MoveOperation } from "@/types/files";
import { FileInfoVO } from "@/interface/files";

export const useDragAndDrop = (
  file: FileInfoVO,
  onMove: (sourceIds: string[], targetId: string) => void
) => {
  const [pendingMove, setPendingMove] = useState<MoveOperation>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: file.type,
    item: { id: file.id, type: file.type, name: file.name },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ isOver }, drop] = useDrop({
    accept: ["FILE", "FOLDER"],
    drop: (item: any) => {
      if (file.type === "FOLDER" && item.id !== file.id) {
        setPendingMove({
          sourceId: item.id,
          sourceName: item.name,
          targetId: file.id,
        });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const handleConfirmMove = () => {
    if (pendingMove) {
      onMove([pendingMove.sourceId], pendingMove.targetId);
      setPendingMove(null);
    }
  };
  const setRefs = (instance: HTMLTableRowElement | null) => {
    drag(drop(instance));
  };
  return {
    isDragging,
    isOver,
    pendingMove,
    setRefs,
    handleConfirmMove,
    setPendingMove,
  };
};
