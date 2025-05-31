"use client";

import { Button } from "@/components/ui/button";
import {
  useInboxNotifications,
  useMarkAllInboxNotificationsAsRead,
  useMarkInboxNotificationAsRead,
  useDeleteInboxNotification, // 新增删除功能hook
} from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem, // 新增下拉菜单项
} from "@radix-ui/react-dropdown-menu";
import {
  BellIcon,
  Check,
  Trash2,
  MoreVertical,
  DeleteIcon,
  Trash2Icon,
} from "lucide-react"; // 新增图标
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@liveblocks/react";
import { InboxNotificationData } from "@liveblocks/client";

const NotificationItem = ({
  inboxNotification,
}: {
  inboxNotification: InboxNotificationData;
}) => {
  // 新增markAsRead和deleteNotification功能
  const markAsRead = useMarkInboxNotificationAsRead();
  const deleteNotification = useDeleteInboxNotification();

  const getNotificationDetails = (inboxNotification: InboxNotificationData) => {
    let senderId = "system";
    if (inboxNotification.kind === "textMention") {
      senderId = inboxNotification.createdBy;
    }

    let content = "";
    let action = "发送了通知";

    if (inboxNotification.kind === "textMention") {
      content = "提到了你";
      action = "提到了你";
    }

    return { senderId, content, action };
  };

  const { senderId, content, action } =
    getNotificationDetails(inboxNotification);

  const userInfo = useUser(senderId);
  const userName = userInfo.user?.name || "系统通知";
  const userAvatar = userInfo.user?.avatar || null;

  const initials = userName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div
      className={clsx(
        "relative px-4 py-3 border-b hover:bg-slate-50 transition-colors group",
        !inboxNotification.readAt && "bg-blue-50"
      )}
    >
      {/* 增强已读/未读视觉区分 - 左侧添加指示条 */}
      {!inboxNotification.readAt && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
      )}

      <div className="flex items-start gap-3">
        <Avatar className="flex-shrink-0">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName} className="size-10" />
          ) : null}
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            {/* 未读消息加粗显示 */}
            <div
              className={clsx(
                "font-medium",
                !inboxNotification.readAt && "font-bold"
              )}
            >
              {userName}
            </div>
            <div className="text-sm text-gray-500">{action}</div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(inboxNotification.notifiedAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </div>

            {/* 新增操作按钮 */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!inboxNotification.readAt && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(inboxNotification.id);
                  }}
                  title="标记为已读"
                >
                  <Check className="size-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(inboxNotification.id);
                }}
                title="删除消息"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  const markAllAsRead = useMarkAllInboxNotificationsAsRead();

  const unreadCount = inboxNotifications.filter((n) => !n.readAt).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="relative" size="icon">
            <BellIcon className="size-5" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 text-xs font-medium text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[420px] p-0 rounded-lg shadow-lg"
        >
          <div className="p-3 flex items-center justify-between bg-slate-50 border-b">
            <h3 className="font-semibold text-sm">通知中心</h3>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs py-1 px-2 h-auto"
              >
                全部已读
              </Button>

              {/* 新增下拉菜单用于批量操作 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-6">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm flex items-center text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    {/* 添加间隔和固定尺寸 */}
                    删除所有消息
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {inboxNotifications.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto">
              {inboxNotifications.map((inboxNotification) => (
                <NotificationItem
                  key={inboxNotification.id}
                  inboxNotification={inboxNotification}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              没有新消息
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator className="h-6" orientation="vertical" />
    </>
  );
};

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
