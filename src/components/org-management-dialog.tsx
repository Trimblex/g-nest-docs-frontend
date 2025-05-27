"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { OrgSettingsForm } from "./org-settings-form";
import { OrgMembersManagement } from "./org-members-management";
import { OrgInfoVO } from "@/interface/orgs";
import { Skeleton } from "./ui/skeleton";
import { Building2, SettingsIcon, UsersIcon, Trash2Icon } from "lucide-react";
import axios from "@/config/axiosConfig";
import { Button } from "./ui/button";
import { useOrg } from "@/providers/org-context";
import { toast } from "sonner";

interface OrgManagementDialogProps {
  org: OrgInfoVO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshOrgs: () => Promise<void>;
}

export const OrgManagementDialog = ({
  org,
  open,
  onOpenChange,
  refreshOrgs,
}: OrgManagementDialogProps) => {
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [curUserRole, setCurUserRole] = useState<"ADMIN" | "MEMBER" | "OWNER">(
    "MEMBER"
  );
  const { switchOrg } = useOrg();

  useEffect(() => {
    loadUserRole();
  }, [org.id]);

  const loadUserRole = async () => {
    const res = await axios.get(`/org/getRole/${org.id}`);
    setCurUserRole(res.data);
  };

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    setTimeout(() => setIsLoading(false), 300);
  };
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 解散组织处理函数
  const handleDisbandOrg = async () => {
    try {
      await axios.delete(`/org/${org.id}`);
      onOpenChange(false);
      setShowDeleteConfirm(false);
      await switchOrg(null);
      await refreshOrgs();
    } catch (error) {
      toast.error("解散组织失败");
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[60vw] max-w-6xl min-h-[600px] p-6 sm:p-8 rounded-xl overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-foreground">管理组织 - </span>
              <span className="text-primary">{org.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-6 h-full">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="sm:w-[220px]"
            >
              <TabsList className="flex flex-col gap-2 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="settings"
                  className="h-12 justify-start px-4 rounded-lg hover:bg-accent data-[state=active]:bg-accent data-[state=active]:shadow-sm w-full"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  组织设置
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="h-12 justify-start px-4 rounded-lg hover:bg-accent data-[state=active]:bg-accent data-[state=active]:shadow-sm w-full"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  成员管理
                </TabsTrigger>
                {curUserRole === "OWNER" && (
                  <TabsTrigger
                    value="disband"
                    className="h-12 justify-start px-4 rounded-lg text-destructive hover:bg-destructive/10 data-[state=active]:bg-destructive/10 w-full"
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    解散组织
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            <div className="flex-1 min-h-[500px] transition-opacity duration-300 overflow-x-hidden">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              ) : (
                <>
                  {activeTab === "settings" && (
                    <OrgSettingsForm
                      org={org}
                      refreshOrgs={refreshOrgs}
                      curUserRole={curUserRole}
                    />
                  )}
                  {activeTab === "members" && (
                    <OrgMembersManagement
                      org={org}
                      refreshOrgs={refreshOrgs}
                      curUserRole={curUserRole}
                    />
                  )}
                  {activeTab === "disband" && curUserRole === "OWNER" && (
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-destructive">
                          解散组织
                        </h3>
                        <p className="text-muted-foreground">
                          此操作将永久删除该组织及其所有相关数据，包括：
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm">
                          <li>所有组织成员信息</li>
                          <li>组织内的所有项目数据</li>
                          <li>所有组织级别的设置和配置</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-destructive font-medium">
                          警告：此操作不可撤销，请谨慎操作！
                        </p>
                        <Button
                          variant="destructive"
                          className="w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <Trash2Icon className="h-4 w-4 mr-2" />
                          确认永久解散组织
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新增删除确认弹窗 */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2Icon className="h-5 w-5" />
              确认解散组织？
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <DialogDescription>
              此操作将永久删除该组织及其所有相关数据，包括：
            </DialogDescription>

            <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
              <li>所有组织成员信息</li>
              <li>组织内的所有项目数据</li>
              <li>所有组织级别的设置和配置</li>
            </ul>

            <div className="bg-destructive/10 p-4 rounded-lg">
              <p className="text-sm text-destructive">
                ⚠️ 警告：此操作不可撤销，请谨慎操作！
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => handleDisbandOrg()}
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              确认永久解散组织
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
