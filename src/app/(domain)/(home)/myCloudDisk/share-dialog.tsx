"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";

export const ShareDialog = ({
  fileIds,
  titleName,
  open,
  onOpenChange,
}: {
  fileIds: string[];
  titleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [expiry, setExpiry] = useState("7");
  const [requireLogin, setRequireLogin] = useState(false);
  const [maxVisits, setMaxVisits] = useState(0);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    toast.message("已复制到剪贴板", {
      duration: 2000,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateLink = async () => {
    try {
      const response = await axios.post("/files/getShareToken", {
        fileId: fileIds[0],
        expiresIn: parseInt(expiry),
        requireLogin,
        maxVisits: maxVisits || 0,
      });

      const data = response.data;
      const newLink = `${window.location.origin}/share/${data}`;
      setShareLink(newLink);
    } catch (error) {
      toast.error("生成分享链接失败");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-blue-500" />
            <span>分享文件</span>
            <span className="text-muted-foreground">{titleName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 有效期设置 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">有效期</Label>
            <Select value={expiry} onValueChange={setExpiry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择有效期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">24 小时</SelectItem>
                <SelectItem value="3">3 天</SelectItem>
                <SelectItem value="7">7 天</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 访问次数限制 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              访问限制
              <label className="text-xs text-gray-500">(0次表示无限制)</label>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={maxVisits}
                onChange={(e) =>
                  setMaxVisits(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-32"
                placeholder="无限制"
              />
              <span className="text-sm text-muted-foreground">次访问</span>
            </div>
          </div>

          {/* 登录要求 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">需要登录</Label>
              <p className="text-sm text-muted-foreground">
                仅允许登录用户访问
              </p>
            </div>
            <Switch checked={requireLogin} onCheckedChange={setRequireLogin} />
          </div>

          <Separator />

          {/* 生成按钮 */}
          <Button onClick={handleGenerateLink} className="w-full" size="lg">
            生成分享链接
          </Button>

          {/* 生成结果展示 */}
          {shareLink && (
            <div className="rounded-lg border p-4">
              <Label className="text-sm font-medium">分享链接</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  aria-label="复制链接"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>剩余次数: {maxVisits || "∞"}</span>
                <span>•</span>
                <span>有效期: {expiry}天</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
