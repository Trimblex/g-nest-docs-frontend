"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Sparkles,
  Copy,
  Check,
  CornerDownLeft,
  Trash2,
} from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import React from "react";
import he from "he";
import axios from "@/config/axiosConfig";
import { useAuth } from "@/providers/auth-context";

type Conversation = {
  id: string;
  question: string;
  answer: string;
  inserted: boolean;
  timestamp: number;
};

const MAX_HISTORY = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const AskAIButton = ({ roomId }: { roomId: string }) => {
  const { editor } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { token } = useAuth();
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const prevConversationsRef = useRef<Conversation[]>([]);
  const [showCopy, setShowCopy] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get("/ai/chat/history", {
        params: { roomId },
      });

      // 转换后端消息为前端对话格式
      const messages = response.data;
      const conversationMap = new Map<string, Conversation>();
      let lastUserMessage = null;

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        if (msg.messageType === "USER") {
          lastUserMessage = msg;
        } else if (msg.messageType === "ASSISTANT" && lastUserMessage) {
          const conversationId = `${lastUserMessage.text}-${msg.text}`;

          if (!conversationMap.has(conversationId)) {
            conversationMap.set(conversationId, {
              id: conversationId,
              question: lastUserMessage.text,
              answer: msg.text,
              inserted: false,
              timestamp: Date.now(), // 使用当前时间戳
            });
          }
          lastUserMessage = null; // 重置等待新的USER消息
        }
      }
      // 转换并排序对话
      const sortedConversations = Array.from(conversationMap.values())
        .sort((a, b) => a.timestamp - b.timestamp) // 按时间升序排列
        .slice(-MAX_HISTORY); // 取最后 MAX_HISTORY 条
      setConversations(sortedConversations);
    } catch (error) {
      toast.error("无法加载对话历史");
      console.error("无法加载对话历史:", error);
    }
  }, [token]);
  // 初始化加载历史记录
  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen, fetchHistory]);

  useEffect(() => {
    const prevConvs = prevConversationsRef.current;
    const currentConvs = conversations;

    // 检测新消息添加到末尾的逻辑
    const isNewItemAdded =
      currentConvs.length > prevConvs.length ||
      (currentConvs.length > 0 &&
        prevConvs.length > 0 &&
        currentConvs[currentConvs.length - 1].id !==
          prevConvs[prevConvs.length - 1].id);
    if (isNewItemAdded && conversationContainerRef.current) {
      const container = conversationContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }

    prevConversationsRef.current = currentConvs;
  }, [conversations]);

  // 处理生成回答
  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("请输入问题");
      return;
    }

    setIsLoading(true);
    const tempId = Date.now().toString();

    setConversations((prev) => [
      ...prev.slice(-MAX_HISTORY + 1), // 保留最后 MAX_HISTORY-1 条
      {
        id: tempId,
        question: input,
        answer: "▍生成中...",
        inserted: false,
        timestamp: Date.now(),
      },
    ]);
    setInput("");
    setCurrentStreamId(tempId);
    try {
      const documentText = editor?.getText() ?? "";

      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          message: input,
          text: documentText.slice(0, 10000),
        }),
      });
      if (!response.body) throw new Error("无响应内容");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // 处理可能的分块情况
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 保留未完成的行
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const jsonStr = line.replace(/^data:\s*/, "");
              const responseData = JSON.parse(jsonStr);

              // 正确解析Spring AI响应结构
              const chunkText = responseData?.result?.output?.text || "";
              fullResponse += chunkText;
              fullResponse = fullResponse.replace(/▍/g, "") + "▍"; // 先清除旧符号再加新符号

              // 更新最终回答
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === tempId ? { ...c, answer: fullResponse } : c
                )
              );
            } catch (e: Error | any) {
              toast.error("解析错误");
              console.error("解析错误:", e);
            }
          }
        }
      }
      // 处理剩余buffer
      if (buffer) {
        try {
          const jsonStr = buffer.replace(/^data:\s*/, "");
          const responseData = JSON.parse(jsonStr);
          fullResponse += responseData?.result?.output?.content || "";
        } catch (e: Error | any) {
          toast.error("最终解析错误");
          toast.error(e.message);
        }
      }
      // 更新最终状态
      setConversations((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, answer: fullResponse } : c))
      );
    } catch (error: Error | any) {
      toast.error("生成失败");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? { ...c, answer: `❌ 生成失败: ${error.message}` }
            : c
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentStreamId(null);
      setInput("");
      // 重新获取最新历史
      await fetchHistory();
    }
  };
  // 清空对话历史
  const handleClearAll = async () => {
    try {
      await axios.delete("/ai/chat/clear", {
        params: { roomId },
      });
      setConversations([]);
      toast.info("已清空所有对话历史");
    } catch (error) {
      toast.error("清空历史失败");
      console.error(error);
    }
  };

  // 删除单条对话
  const handleDelete = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    toast.info("对话已删除");
  };

  const handleInsert = (conversationId: string) => {
    if (!editor) return;

    const target = conversations.find((c) => c.id === conversationId);
    if (!target || target.inserted) return;

    editor.commands.insertContent(target.answer);
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, inserted: true } : c))
    );
    toast.success("内容已插入");
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("已复制到剪贴板");
  };

  return (
    <>
      {/* 工具栏按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-7 min-h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 text-sm"
      >
        <Sparkles className="size-4 text-yellow-600" />
      </button>

      {/* 对话弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-yellow-600" />
              AI 写作助手
              {conversations.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-7 text-red-600"
                >
                  清空历史
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* 状态栏 */}
          <div className="text-sm text-neutral-500">
            历史对话: {conversations.length} 条
            <span className="ml-2 text-blue-600">
              (保留最近{MAX_HISTORY}条上下文)
            </span>
          </div>
          {/* 对话历史区域 */}
          <div
            ref={conversationContainerRef}
            className="flex-1 overflow-y-auto space-y-4 py-4"
          >
            {conversations.map((conv) => (
              <div key={conv.id} className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Q: {conv.question}
                    </span>
                    {conv.inserted && (
                      <span className="text-xs text-green-600">✓ 已插入</span>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(conv.id)}
                      className="h-7 w-7 text-red-500 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(conv.answer)}
                      className="h-7 w-7"
                      disabled={isLoading}
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant={conv.inserted ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInsert(conv.id)}
                      className="h-7"
                      disabled={isLoading || conv.inserted}
                    >
                      {conv.inserted ? (
                        <Check className="size-4" />
                      ) : (
                        "插入文档"
                      )}
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-3 rounded-lg border markdown-container",
                    conv.inserted
                      ? "bg-green-50 border-green-200"
                      : "bg-neutral-50 border-neutral-200"
                  )}
                >
                  <div className="relative">
                    <ReactMarkdown
                      // className="prose max-w-none"
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code({ node, className, children, ...props }) {
                          const getCodeString = (
                            children: React.ReactNode
                          ): string => {
                            if (typeof children === "string") return children;
                            return React.Children.toArray(children)
                              .map((child: any) => {
                                if (typeof child === "string") return child;
                                if (child.props?.children)
                                  return getCodeString(child.props.children);
                                return "";
                              })
                              .join("");
                          };
                          // 解码 HTML 实体并保留原始空白符
                          const rawCode = he.decode(
                            getCodeString(children)
                              .replace(/\n$/, "") // 保留最后一个换行
                              .replace(/&nbsp;/g, " ") // 转换不换行空格
                          );
                          const codeContent = String(children).replace(
                            /\n$/,
                            ""
                          );

                          const isCodeBlock =
                            node?.position?.start.line !==
                            node?.position?.end.line;
                          const language = className?.replace(/language-/, "");
                          const handleCopy = async () => {
                            try {
                              // 写入纯文本和带语法的 HTML 两种格式
                              const blob = new Blob([rawCode], {
                                type: "text/plain",
                              });
                              const htmlBlob = new Blob(
                                [
                                  `<pre><code class="language-${language}">${rawCode}</code></pre>`,
                                ],
                                { type: "text/html" }
                              );
                              const clipboardItem = new ClipboardItem({
                                "text/plain": blob,
                                "text/html": htmlBlob,
                              });

                              await navigator.clipboard.write([clipboardItem]);
                              setCopiedCode(rawCode);
                              toast.success("代码已复制（保留原始格式）");
                            } catch (err) {
                              toast.error("复制失败，请手动选择复制");
                              console.error("复制失败，请手动选择复制:", err);
                            }
                          };
                          return isCodeBlock ? (
                            <div
                              className="relative group"
                              onMouseEnter={() => setShowCopy(true)}
                              onMouseLeave={() => setShowCopy(false)}
                            >
                              <pre className="bg-neutral-100 p-3 rounded-md overflow-x-auto">
                                <code
                                  className={cn("text-sm", className)}
                                  {...props}
                                >
                                  {children}
                                </code>
                              </pre>
                              <button
                                onClick={handleCopy}
                                className={cn(
                                  "absolute right-2 top-2 p-1.5 rounded bg-white/80 hover:bg-neutral-200 transition-opacity",
                                  showCopy || copiedCode === codeContent
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              >
                                {copiedCode === codeContent ? (
                                  <Check className="size-4 text-green-600" />
                                ) : (
                                  <Copy className="size-4" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <code
                              className={cn(
                                "bg-neutral-100 rounded px-1 py-0.5",
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {conv.answer.replace(/▍/g, "")}
                    </ReactMarkdown>
                    {currentStreamId === conv.id && (
                      <span className="animate-pulse absolute bottom-1 right-1">
                        ▍
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            {/* 输入区域 */}
            <div className="relative w-200 mr-10">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isLoading && handleGenerate()
                }
                placeholder="输入问题后按 Enter 生成（例如：请优化这段文字）"
                className="pr-12"
              />
              <CornerDownLeft className="absolute right-3 top-2.5 size-5 text-neutral-400" />
            </div>
            <Button
              onClick={handleGenerate}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={isLoading}
              className="w-20"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "开始生成"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
