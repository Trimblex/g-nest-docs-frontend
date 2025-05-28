"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./actions";
import { toast } from "sonner";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";

import { useAuth } from "@/providers/auth-context";
import axios from "@/config/axiosConfig";

type User = {
  id: string;
  name: string;
  avatar: string;
};

interface RoomProps {
  children: ReactNode;
}
export function Room({ children }: RoomProps) {
  const params = useParams();
  const { user, token } = useAuth();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkOrgChanged = async () => {
      const curOrgId = searchParams.get("org");
      if (curOrgId) {
        const document = await axios
          .get(`/documents/${params.documentId}`)
          .then((res) => {
            return res.data;
          })
          .catch((err: Error) => {
            toast.error("获取文档失败");
            console.log(err);
            return null;
          });
        if (document.organizationId != curOrgId) {
          router.push("/desktop/" + (params.path ?? ""));
        }
      }
    };
    checkOrgChanged();
  }, [searchParams, pathname, router, params.path, params.documentId]);

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(() => {
    return async () => {
      try {
        const list = await getUsers(user?.currentOrgId!, token!);
        setUsers(list);
      } catch (error: Error | any) {
        toast.error("获取用户信息失败");
        console.log(error);
      }
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const document = await axios
          .get(`/documents/${params.documentId}`)
          .then((res) => {
            return res.data;
          })
          .catch((err: Error) => {
            toast.error(err.message);
            return null;
          });
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ document, user }),
        });
        return await response.json();
      }}
      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const res = await axios.post("/documents/getByIds", {
          ids: roomIds as string[],
        });
        const documents = res.data;
        return documents.map((document: DocumentInfoVO) => {
          return {
            id: document.id,
            name: document.title,
          };
        });
      }}
    >
      <RoomProvider
        id={params.documentId as string}
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT,
        }}
      >
        <ClientSideSuspense
          fallback={<FullScreenLoader label="房间加载中..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
