import { TableCell, TableRow } from "@/components/ui/table";

import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { format } from "date-fns";
import { DocumentMenu } from "./document-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-context";

interface DocumentRowProps {
  document: DocumentInfoVO;
  loadData: () => void;
}

export const DocumentRow = ({ document, loadData }: DocumentRowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const preserveQueryParams = () => {
    // 克隆现有的查询参数
    const newParams = new URLSearchParams(searchParams.toString());

    // 如果当前没有org参数且文档有organizationId，则添加
    if (!newParams.has("org") && document.organizationId) {
      newParams.set("org", document.organizationId);
    }

    // 拼接新的查询字符串
    const queryString = newParams.toString();
    return `/documents/${document.id}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <TableRow
      onDoubleClick={() => router.push(preserveQueryParams())}
      className="cursor-pointer"
    >
      <TableCell className="w-[59px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId
          ? `${document.ownerId === user?.id ? "你" : document.ownerName}（${
              document.organizationName
            }）`
          : "你"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document.createdAt), "yyyy年MM月dd日 HH:mm")}
      </TableCell>
      <TableCell className="flex ml-auto justify-end">
        <DocumentMenu
          document={document}
          title={document.title}
          loadData={loadData}
          onNewTab={() => window.open(`/documents/${document.id}`, "_blank")}
        />
      </TableCell>
    </TableRow>
  );
};
