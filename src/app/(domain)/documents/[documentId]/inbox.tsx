"use client";

import { Button } from "@/components/ui/button";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { BellIcon } from "lucide-react";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const Inbox = () => {
  return (
    <ClientSideSuspense
      fallback={
        <>
          <Button variant={"ghost"} disabled className="relative" size="icon">
            <BellIcon className="size-5" />
          </Button>
          <Separator className="h-6" orientation="vertical" />
        </>
      }
    >
      <InboxMenu />
    </ClientSideSuspense>
  );
};

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="relative" size="icon">
            <BellIcon className="size-5" />

            {inboxNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 text-xs font-medium text-white flex items-center justify-center">
                {inboxNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {inboxNotifications.length > 0 ? (
            <InboxNotificationList>
              {inboxNotifications.map((inboxNotification) => (
                <InboxNotification
                  key={inboxNotification.id}
                  inboxNotification={inboxNotification}
                />
              ))}
            </InboxNotificationList>
          ) : (
            <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
              没有消息
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator className="h-6" orientation="vertical" />
    </>
  );
};
