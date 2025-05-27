import { Button } from "@/components/ui/button";

export const PaginationControl = ({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center p-4">
      <Button
        variant="ghost"
        onClick={onLoadMore}
        className="text-primary"
        disabled={isLoading}
      >
        {isLoading ? "正在加载..." : "加载更多文件"}
      </Button>
    </div>
  );
};
