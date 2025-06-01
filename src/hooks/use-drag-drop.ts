import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";
import type { MoveOperation } from "@/types/files";
import { FileInfoVO } from "@/interface/files";

export const useDragAndDrop = (
  file: FileInfoVO,
  selectedIds: string[], // 添加 selectedIds 参数
  onMove: (sourceIds: string[], targetId: string) => void,
  pathHierarchy: Array<{ id: string; name: string }>
) => {
  const [pendingMove, setPendingMove] = useState<MoveOperation>(null);
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;
  const dragItem =
    selectedIds.includes(file.id) && selectedIds.length > 1
      ? { ids: selectedIds, type: "MULTI", name: `${selectedIds.length}个文件` }
      : { ids: [file.id], type: file.type, name: file.name };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FILE_ITEM",
    item: () => {
      // 使用 ref 获取最新的选中状态
      const currentIds = selectedIdsRef.current;

      // 如果是多选且包含当前文件，返回所有选中文件
      if (currentIds.includes(file.id) && currentIds.length > 1) {
        return {
          ids: currentIds,
          type: "MULTI",
          name: `${currentIds.length}个文件`,
        };
      }

      // 否则返回单个文件
      return {
        ids: [file.id],
        type: file.type,
        name: file.name,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop({
    accept: ["FILE_ITEM", "MULTI"],
    drop: (item: any) => {
      const draggedIds = item.ids || [item.id];
      const isMovingToSelf = draggedIds.includes(file.id);
      const isMovingToParent = pathHierarchy.some((folder) =>
        draggedIds.includes(folder.id)
      );
      // 检查是否可以移动到目标文件夹
      if (file.type === "FOLDER" && !isMovingToSelf && !isMovingToParent) {
        setPendingMove({
          sourceIds: draggedIds,
          sourceName:
            draggedIds.length > 1 ? `${draggedIds.length}个文件` : item.name,
          targetId: file.id,
        });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const handleConfirmMove = () => {
    if (pendingMove) {
      onMove(pendingMove.sourceIds, pendingMove.targetId);
      setPendingMove(null);
    }
  };
  const setRefs = (instance: HTMLElement | null) => {
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
