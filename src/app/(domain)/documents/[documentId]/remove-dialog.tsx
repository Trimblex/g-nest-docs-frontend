"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import axios from "@/config/axiosConfig";
import { GNestResponse } from "@/interface/common";
import { AxiosError } from "axios";

interface RemoveDialogProps {
  document: DocumentInfoVO;
  children: React.ReactNode;
  loadData?: () => void;
}

export const RemoveDialog = ({
  document,
  children,
  loadData,
}: RemoveDialogProps) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const pathname = usePathname();
  const handleRemove = () => {
    console.log("remove");
    axios
      .delete(`/documents/${document.id}`)
      .then(() => {
        toast.success("删除成功");
        if (!pathname.startsWith("/desktop")) {
          router.push("/desktop");
        }
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
      })
      .finally(() => {
        setIsRemoving(false);
        loadData && loadData();
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(event) => event.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>你确定？</AlertDialogTitle>
          <AlertDialogDescription>删除后，无法恢复。</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
            取消
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);
              handleRemove();
            }}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
