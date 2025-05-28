"use client";
import React, { useCallback, useEffect, useState } from "react";
import Editor from "./editor";
import { Toolbar } from "./toolbar";
import { Navbar } from "./navbar";
import { Room } from "./room";
import axios from "@/config/axiosConfig";
import { useOrg } from "@/providers/org-context";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { OrgMemberVO } from "@/interface/orgs";
import { useAuth } from "@/providers/auth-context";
import { GNestResponse } from "@/interface/common";

interface DocumentProps {
  documentId: string;
}
type User = {
  id: string;
  name: string;
  avatar: string;
};

export const Document = ({ documentId }: DocumentProps) => {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [document, setDocument] = useState<DocumentInfoVO | null>(null); // 初始为null
  const [users, setUsers] = useState<User[]>([]);
  const preserveQueryParams = () => {
    const query = searchParams.toString();
    return `/desktop${query ? `?${query}` : ""}`;
  };

  const getUsers = useCallback(async (organizationId: string | null) => {
    const res = await axios.post(`/org/getMembers`, {
      orgId: organizationId,
    });
    const users = res.data.map((member: OrgMemberVO) => ({
      id: member.userId,
      name: member.username ?? member.email ?? "匿名",
      avatar: member.avatarUrl,
    }));
    return users;
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const list = await getUsers(document?.organizationId!);
      setUsers(list);
    } catch (error: Error | any) {
      toast.error("获取用户信息失败");
      console.log(error);
    }
  }, [user, getUsers, document]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    axios
      .post(`/documents/checkAndGet`, {
        documentId: documentId,
        orgId: currentOrg?.id,
      })
      .then((res: { data: DocumentInfoVO }) => {
        const data = res.data;

        setDocument(data);
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
        router.push(preserveQueryParams());
      });
  }, [currentOrg, documentId, searchParams, router]);

  // 等待数据加载完成后再渲染Room和内容
  if (!document) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center">
        加载文档中...
      </div>
    );
  }

  return (
    <Room document={document} users={users}>
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
