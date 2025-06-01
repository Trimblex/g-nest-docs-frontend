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
import { useEffect, useState } from "react";
import { useSearchParam } from "@/hooks/use-search-param";
import { useOrg } from "@/providers/org-context";
import axios from "@/config/axiosConfig";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { GNestResponse } from "@/interface/common";

interface DocumentsTableProps {}
export const DocumentsTable = ({}: DocumentsTableProps) => {
  const [documents, setDocuments] = useState<DocumentInfoVO[]>([]);
  const [nextCursor, setNextCursor] = useState("0");
  const [hasMore, setHasMore] = useState(false);
  const [search] = useSearchParam();
  const { currentOrg, switchOrg } = useOrg();

  const loadData = () => {
    axios
      .get("/documents/paginated", {
        params: {
          search,
          pageSize: 5,
        },
      })
      .then((res) => {
        setDocuments(res.data.results);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
      });
  };
  useEffect(() => {
    loadData();
  }, [currentOrg, search]);

  const loadMore = (cursor: string, pageSize: number) => {
    axios
      .get("/documents/paginated", {
        params: {
          search,
          pageSize,
          cursor,
        },
      })
      .then((res) => {
        setDocuments(documents.concat(res.data.results));
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
      });
  };

  useEffect(() => {
    switchOrg(currentOrg?.id ?? null);
  }, []);
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
                <DocumentRow
                  key={document.id}
                  document={document}
                  loadData={loadData}
                />
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
