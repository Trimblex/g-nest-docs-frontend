import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export const HeaderSection = ({ usedSpace }: { usedSpace: number }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          我的云盘
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          已使用 {usedSpace.toFixed(1)} GB / 5 GB
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => router.push(`/myCloudDisk/trash?fileId=0`)}
          className="hidden sm:inline-flex"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          回收站
        </Button>
      </div>
    </div>
  );
};
