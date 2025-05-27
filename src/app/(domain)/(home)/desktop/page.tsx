"use client";
import { TemplateGallery } from "./template-gallery";

import { DocumentsTable } from "./documents-table";
import { useSearchParam } from "@/hooks/use-search-param";
import { useOrg } from "@/providers/org-context";
import { useEffect, useState } from "react";

import axios from "@/config/axiosConfig";
import { toast } from "sonner";
export default function Home() {
  const [search] = useSearchParam();
  const { currentOrg, switchOrg } = useOrg();
  const [results, setResults] = useState<DocumentInfoVO[]>([]);
  const [nextCursor, setNextCursor] = useState("0");
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    axios
      .get("/documents/paginated", {
        params: {
          search,
          pageSize: 5,
        },
      })
      .then((res) => {
        setResults(res.data.results);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => toast.error(err.message));
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
        setResults(results.concat(res.data.results));
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    switchOrg(currentOrg?.id ?? null);
  }, []);

  return (
    <>
      <div className="p-4">
        <TemplateGallery />
        <DocumentsTable
          documents={results}
          nextCursor={nextCursor}
          loadMore={loadMore}
          hasMore={hasMore}
        />
      </div>
    </>
  );
}
