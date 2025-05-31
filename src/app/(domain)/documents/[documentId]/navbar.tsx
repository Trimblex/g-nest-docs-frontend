"use client";
import Image from "next/image";
import Link from "next/link";
import { DocumentInput } from "./document-input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatars } from "./avatars";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { Inbox } from "./inbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RemoveDialog } from "./remove-dialog";
import { RenameDialog } from "./rename-dialog";
import {
  writeDocx,
  DocxSerializer,
  defaultNodes,
  defaultMarks,
} from "prosemirror-docx";
import { saveAs } from "file-saver";
import { useCallback, useState } from "react";
import WordImporter from "./word-import";
import { OrgSwitcher } from "@/components/org-switcher";
import { CustomUserButton } from "@/components/custom-user-button";
import axios from "@/config/axiosConfig";
import { GNestResponse } from "@/interface/common";
import { AxiosError } from "axios";

interface NavbarProps {
  data: DocumentInfoVO;
}

const nodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,

  image(state: any, node: any) {
    state.renderInline(node);
    state.closeBlock(node);
  },
};

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);
export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();
  const [isImport, setIsImport] = useState(false);

  const onSaveDocx = useCallback(async () => {
    try {
      if (!editor) {
        toast.error("编辑器未初始化");
        return;
      }

      const opts = {
        getImageBuffer(src: string) {
          try {
            return Buffer.from(src);
          } catch (error) {
            toast.error("图片加载失败");
            console.error("图片加载失败:", src, error);
            return Buffer.from("");
          }
        },
      };

      const startTime = performance.now();
      const wordDocument = docxSerializer.serialize(editor.state.doc, opts);

      await writeDocx(wordDocument, (buffer) => {
        saveAs(new Blob([buffer]), `${data.title}.docx`);
        toast.success(
          `文档保存成功 (${Math.round(performance.now() - startTime)}ms)`
        );
      });
    } catch (error) {
      toast.error("文档保存失败，请检查控制台");
      console.error(error);
    }
  }, [editor?.state.doc, data.title]);

  const onNewDocument = () => {
    axios
      .post("/documents", {
        title: "未命名文档",
        content: "",
      })
      .then((res) => {
        toast.success("新建文档成功");
        router.push(`/documents/${res.data.id}`);
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
      });
  };

  const handleConvert = (html: string) => {
    // 可以在这里将html插入到tiptap编辑器
    editor?.chain().focus().setContent(html).run();
    setIsImport(false);
  };
  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const onDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const json = editor.getJSON();
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const blob = new Blob([html], { type: "text/html" });
    onDownload(blob, `${data.title}.html`);
  };
  const onSaveText = () => {
    if (!editor) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: "text/plain" });
    onDownload(blob, `${data.title}.txt`);
  };

  return (
    <>
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/desktop">
            <Image src="/logo.svg" alt="Logo" height={36} width={36} />
          </Link>
          <div className="flex flex-col">
            <DocumentInput title={data.title} id={data.id} />
            <div className="flex">
              <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                <MenubarMenu>
                  <MenubarTrigger>文件</MenubarTrigger>
                  <MenubarContent className="print:hidden">
                    <MenubarSub>
                      <MenubarSubTrigger>
                        <FileIcon className="size-4 mr-2" />
                        导出
                      </MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem onClick={onSaveDocx}>
                          <FileJsonIcon className="size-4 mr-2" />
                          Word
                        </MenubarItem>
                        <MenubarItem onClick={onSaveJSON}>
                          <FileJsonIcon className="size-4 mr-2" />
                          JSON
                        </MenubarItem>
                        <MenubarItem onClick={onSaveHTML}>
                          <GlobeIcon className="size-4 mr-2" />
                          HTML
                        </MenubarItem>
                        <MenubarItem onClick={() => window.print()}>
                          <BsFilePdf className="size-4 mr-2" />
                          PDF
                        </MenubarItem>
                        <MenubarItem onClick={onSaveText}>
                          <FileTextIcon className="size-4 mr-2" />
                          Text
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem onClick={() => setIsImport(true)}>
                      <PlusIcon className="size-4 mr-2" />
                      导入
                    </MenubarItem>
                    <MenubarItem onClick={onNewDocument}>
                      <FilePlusIcon className="size-4 mr-2" />
                      新建
                    </MenubarItem>
                    <MenubarSeparator />
                    <RenameDialog
                      documentId={data.id}
                      initialTitle={data.title}
                    >
                      <MenubarItem
                        onClick={(e) => e.stopPropagation()}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <FilePenIcon className="size-4 mr-2" />
                        重命名
                      </MenubarItem>
                    </RenameDialog>
                    <RemoveDialog documentId={data.id}>
                      <MenubarItem
                        onClick={(e) => e.stopPropagation()}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <TrashIcon className="size-4 mr-2" />
                        删除
                      </MenubarItem>
                    </RemoveDialog>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => window.print()}>
                      <PrinterIcon className="size-4 mr-2" />
                      打印 <MenubarShortcut>⌘P</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-normal py-0.5 px-[17px] rounded-sm hover:bg-muted h-auto">
                    编辑
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem
                      onClick={() => editor?.chain().focus().undo().run()}
                    >
                      <UndoIcon className="size-4 mr-2" />
                      撤销 <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() => editor?.chain().focus().redo().run()}
                    >
                      <Redo2Icon className="size-4 mr-2" />
                      重做 <MenubarShortcut>⌘Y</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-normal py-0.5 px-[17px] rounded-sm hover:bg-muted h-auto">
                    插入
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarSub>
                      <MenubarSubTrigger>表格</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem
                          onClick={() => insertTable({ rows: 1, cols: 1 })}
                        >
                          1 x 1
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => insertTable({ rows: 2, cols: 2 })}
                        >
                          2 x 2
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => insertTable({ rows: 3, cols: 3 })}
                        >
                          3 x 3
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => insertTable({ rows: 4, cols: 4 })}
                        >
                          4 x 4
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-normal py-0.5 px-[17px] rounded-sm hover:bg-muted h-auto">
                    格式
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarSub>
                      <MenubarSubTrigger>
                        <TextIcon className="size-4 mr-2" />
                        文本
                      </MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem
                          onClick={() =>
                            editor?.chain().focus().toggleBold().run()
                          }
                        >
                          <BoldIcon className="size-4 mr-2" />
                          加粗 <MenubarShortcut>⌘B</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem
                          onClick={() =>
                            editor?.chain().focus().toggleItalic().run()
                          }
                        >
                          <ItalicIcon className="size-4 mr-2" />
                          斜体 <MenubarShortcut>⌘I&nbsp;</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem
                          onClick={() =>
                            editor?.chain().focus().toggleUnderline().run()
                          }
                        >
                          <UnderlineIcon className="size-4 mr-2" />
                          下划线 <MenubarShortcut>⌘U</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem
                          onClick={() =>
                            editor?.chain().focus().toggleStrike().run()
                          }
                        >
                          <StrikethroughIcon className="size-4 mr-2" />
                          删除线&nbsp;&nbsp;
                          <MenubarShortcut>⌘S</MenubarShortcut>
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem
                      onClick={() =>
                        editor?.chain().focus().unsetAllMarks().run()
                      }
                    >
                      <RemoveFormattingIcon className="size-4 mr-2" />
                      清除格式
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pl-6">
          <Avatars />
          <Inbox />
          <OrgSwitcher />
          <CustomUserButton />
        </div>
      </nav>
      {isImport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsImport(false)}
        >
          <div
            className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <WordImporter onConvert={handleConvert} />
          </div>
        </div>
      )}
    </>
  );
};
