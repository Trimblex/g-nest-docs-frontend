"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import axios from "@/config/axiosConfig";
import { toast } from "sonner";
import { OrgInfoVO, OrgMemberVO } from "@/interface/orgs";
import { Badge } from "./ui/badge";
import { SendIcon, ShieldIcon, Trash2Icon, UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const OrgMembersManagement = ({
  org,
  refreshOrgs,
  curUserRole,
}: {
  org: OrgInfoVO;
  refreshOrgs: () => Promise<void>;
  curUserRole: string;
}) => {
  const [members, setMembers] = useState<OrgMemberVO[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER" | "OWNER">("MEMBER");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await axios.post(`/org/getMembers`, {
          orgId: org.id,
        });
        setMembers(res.data);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, [org.id]);

  const handleInvite = async () => {
    if (!emailInput.trim()) {
      toast.warning("请输入邮箱地址");
      return;
    }

    try {
      await axios.post(
        `/org/invite`,
        {
          orgId: org.id,
          emails: emailInput.split(/[,\s]+/),
          role,
        },
        {
          headers: {
            "X-Frontend-Host": process.env.NEXT_PUBLIC_BASE_URL, // 自动携带当前前端域名和端口
          },
        }
      );
      setEmailInput("");
      await refreshOrgs();
      toast.success("🎉 邀请已发送", {
        description: "新成员将会收到邀请邮件",
      });
    } catch (error) {
      toast.error("邀请失败", {
        description: "请检查邮箱格式或网络连接",
      });
      console.error(error);
    }
  };

  const updateMemberRole = async (
    userId: string,
    newRole: "ADMIN" | "MEMBER" | "OWNER"
  ) => {
    try {
      await axios.put(`/org/member/role`, {
        orgId: org.id,
        userId,
        role: newRole,
      });
      await refreshOrgs();
    } catch (error) {
      toast.error("角色更新失败");
      console.error(error);
    }
  };

  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState("");

  const RemoveMemberDialog = () => {
    return (
      <Dialog
        open={removeMemberDialogOpen}
        onOpenChange={setRemoveMemberDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除成员</DialogTitle>
            <DialogDescription>确定要删除该成员吗？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveMemberDialogOpen(false)}
            />
            <Button
              variant="destructive"
              onClick={() => {
                removeMember(removeMemberId);
                setRemoveMemberDialogOpen(false);
              }}
            ></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const removeMember = async (userId: string) => {
    try {
      await axios.post(`/org/member/remove`, {
        orgId: org.id,
        userId,
      });
    } catch (error) {
      toast.error("移除成员失败");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 邀请表单区块 */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">邀请新成员</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="成员邮箱（多个用逗号分隔）"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1"
          />
          <Select
            value={role}
            onValueChange={(v: "ADMIN" | "MEMBER" | "OWNER") => setRole(v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">
                <div className="flex items-center">
                  <ShieldIcon className="mr-2 h-4 w-4 text-gray-500" />
                  管理员
                </div>
              </SelectItem>
              <SelectItem value="MEMBER">
                <span className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                  普通成员
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleInvite} className="sm:w-auto">
            <SendIcon className="mr-2 h-4 w-4" />
            发送邀请
          </Button>
        </div>
      </div>

      {/* 成员列表区块 */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">
          当前成员 ({members.length})
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.email}</span>
                    <Badge
                      variant={
                        member.role === "OWNER"
                          ? "secondary"
                          : member.role === "ADMIN"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {member.role === "OWNER"
                        ? "拥有者"
                        : member.role === "ADMIN"
                        ? "管理员"
                        : "成员"}
                    </Badge>
                  </div>
                  {/* <p className="text-sm text-muted-foreground">
                    加入时间: {new Date(member.createdAt).toLocaleDateString()}
                  </p> */}
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    disabled={member.role === "OWNER"}
                    value={member.role}
                    onValueChange={(v: "ADMIN" | "MEMBER" | "OWNER") =>
                      updateMemberRole(member.userId, v)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">管理员</SelectItem>
                      <SelectItem value="MEMBER">成员</SelectItem>
                      <SelectItem value="OWNER" disabled={true}>
                        拥有者
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={
                      curUserRole === "MEMBER" || member.role === "OWNER"
                    }
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setRemoveMemberDialogOpen(true);
                      setRemoveMemberId(member.userId);
                    }}
                    className="gap-1"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">移除</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {removeMemberDialogOpen && <RemoveMemberDialog />}
    </div>
  );
};
