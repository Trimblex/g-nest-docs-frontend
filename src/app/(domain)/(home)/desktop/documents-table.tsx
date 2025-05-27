import { LoaderIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";

interface DocumentsTableProps {
  documents: DocumentInfoVO[] | undefined;
  nextCursor: string;
  loadMore: (cursor: string, pageSize: number) => void;
  hasMore: boolean;
}
export const DocumentsTable = ({
  documents,
  nextCursor,
  loadMore,
  hasMore,
}: DocumentsTableProps) => {
  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {documents === undefined ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table className="relative w-full overflow-x-auto">
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell ">所有者</TableHead>
              <TableHead className="hidden md:table-cell">创建时间</TableHead>
            </TableRow>
          </TableHeader>
          {documents.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  这里空空如也~
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {documents.map((document) => (
                <DocumentRow key={document.id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(nextCursor, 5)}
          disabled={!hasMore}
        >
          {hasMore ? "加载更多" : "已经到底了"}
        </Button>
      </div>
    </div>
  );
};
