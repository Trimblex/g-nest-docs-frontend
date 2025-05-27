import { TableCell, TableRow } from "@/components/ui/table";

import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { format } from "date-fns";
import { DocumentMenu } from "./document-menu";
import { useRouter } from "next/navigation";

interface DocumentRowProps {
  document: DocumentInfoVO;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();

  return (
    <TableRow
      onDoubleClick={() => router.push(`/documents/${document.id}`)}
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
        {document.organizationId ? "组织" : "个人"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document.createdAt), "yyyy年MM月dd日 HH:mm")}
      </TableCell>
      <TableCell className="flex ml-auto justify-end">
        <DocumentMenu
          documentId={document.id}
          title={document.title}
          onNewTab={() => window.open(`/documents/${document.id}`, "_blank")}
        />
      </TableCell>
    </TableRow>
  );
};
