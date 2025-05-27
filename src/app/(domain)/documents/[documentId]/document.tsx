"use client";
import React, { useEffect, useState } from "react";
import Editor from "./editor";
import { Toolbar } from "./toolbar";
import { Navbar } from "./navbar";
import { Room } from "./room";
import axios from "@/config/axiosConfig";
import { useAuth } from "@/providers/auth-context";
import { useOrg } from "@/providers/org-context";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface DocumentProps {
  documentId: string;
}
export const Document = ({ documentId }: DocumentProps) => {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const [document, setDocument] = useState<DocumentInfoVO>({
    id: "",
    title: "",
    content: "",
    ownerId: user?.id ?? "",
    organizationId: currentOrg?.id ?? "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  useEffect(() => {
    axios
      .get(`/documents/${documentId}`)
      .then((res) => {
        setDocument(res.data);
        return res.data;
      })
      .catch((err: AxiosError) => {
        toast.error("文档加载失败");
        console.log(err.response?.data);

        return null;
      });
  }, [currentOrg, documentId]);
  return (
    <Room>
      <div className="min-h-screen bg-[#FAFBFD]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} />
          <Toolbar />
        </div>
        <div className="pt-[114px] print:pt-0">
          <Editor initialContent={document.content} />
        </div>
      </div>
    </Room>
  );
};
