"use client";

import { ReactNode, useCallback } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";

import { useAuth } from "@/providers/auth-context";
import axios from "@/config/axiosConfig";

type User = {
  id: string;
  name: string;
  avatar: string;
};
interface RoomProps {
  users: User[];
  document: DocumentInfoVO;
  children: ReactNode;
}
export function Room({ children, document, users }: RoomProps) {
  const { user } = useAuth();

  const authEndpoint = useCallback(async () => {
    const endpoint = "/apiLocal/liveblocks-auth";

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ document, user }),
    });
    return await response.json();
  }, [user]);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
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
        id={document?.id as string}
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
