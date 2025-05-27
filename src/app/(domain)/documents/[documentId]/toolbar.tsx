"use client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { type ColorResult, SketchPicker } from "react-color";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { type Level } from "@tiptap/extension-heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { AskAIButton } from "./ask-ai";
import { useState } from "react";

// TODO 有bug
// const FormatBrushButton = () => {
//   const { editor } = useEditorStore();
//   const [isActive, setIsActive] = useState(false);
//   const savedFormats = useRef<{
//     marks: Record<string, any>;
//     node?: { type: string; attrs: Record<string, any> };
//   } | null>(null);

//   // 更精准的格式收集
//   const collectFormats = () => {
//     if (!editor) return null;
//     const { selection, doc } = editor.state;

//     // 获取完整的marks集合
//     const marks = editor.getAttributes("textStyle");
//     const activeMarks = { ...marks };

//     // 收集特殊标记（加粗/斜体等）
//     ["bold", "italic", "underline"].forEach((mark) => {
//       if (editor.isActive(mark)) activeMarks[mark] = true;
//     });

//     // 获取段落级格式
//     const node = selection.$from.parent;
//     const nodeAttrs = { ...node.attrs };

//     // 收集对齐方式（特殊处理）
//     const textAlign = nodeAttrs.textAlign || doc.attrs.textAlign;
//     if (textAlign) nodeAttrs.textAlign = textAlign;

//     return {
//       node: {
//         type: node.type.name,
//         attrs: nodeAttrs,
//       },
//       marks: activeMarks,
//     };
//   };

//   // 更可靠的格式应用
//   const applyFormats = () => {
//     if (!editor || !savedFormats.current) return;

//     editor.chain().focus().unsetAllMarks().run();

//     // 应用段落级格式
//     const nodeFormat = savedFormats.current.node;
//     if (nodeFormat) {
//       // 智能段落类型转换
//       if (nodeFormat.type !== editor.state.selection.$head.parent.type.name) {
//         switch (nodeFormat.type) {
//           case "heading":
//             editor.chain().setHeading({ level: nodeFormat.attrs.level }).run();
//             break;
//           case "paragraph":
//             editor.chain().setParagraph().run();
//             break;
//         }
//       }

//       // 应用段落属性（包括对齐）
//       editor.commands.updateAttributes(nodeFormat.type, nodeFormat.attrs);
//       if (nodeFormat.attrs.textAlign) {
//         editor.commands.setTextAlign(nodeFormat.attrs.textAlign);
//       }
//     }

//     // 应用文本格式
//     const marks = savedFormats.current.marks;
//     Object.entries(marks).forEach(([mark, value]) => {
//       switch (mark) {
//         case "bold":
//           editor.chain().toggleBold().run();
//           break;
//         case "italic":
//           editor.chain().toggleItalic().run();
//           break;
//         case "underline":
//           editor.chain().toggleUnderline().run();
//           break;
//         case "color":
//         case "fontFamily":
//         case "fontSize":
//           editor.chain().setMark(mark, value).run();
//           break;
//       }
//     });
//   };

//   // 优化的事件处理
//   useEffect(() => {
//     if (!editor || !isActive) return;

//     const handleSelectionUpdate = () => {
//       // 延迟执行以确保选区稳定
//       requestAnimationFrame(() => {
//         if (editor.state.selection.empty) return;
//         applyFormats();
//         setIsActive(false); // 应用后立即关闭格式刷
//       });
//     };

//     editor.on("selectionUpdate", handleSelectionUpdate);
//     return () => {
//       editor?.off("selectionUpdate", handleSelectionUpdate);
//     };
//   }, [isActive, editor]);

//   const handleClick = () => {
//     if (!editor) return;

//     if (!isActive) {
//       // 进入格式收集模式
//       const formats = collectFormats();
//       if (formats) {
//         savedFormats.current = formats;
//         setIsActive(true);

//         // 添加临时光标样式
//         editor.view.dom.style.cursor = "copy";
//         setTimeout(() => {
//           if (editor?.view) editor.view.dom.style.cursor = "";
//         }, 2000);
//       }
//     } else {
//       // 取消格式刷模式
//       setIsActive(false);
//     }
//   };

//   return (
//     <ToolbarButton
//       icon={PaintbrushIcon}
//       onClick={handleClick}
//       isActive={isActive}
//     />
//   );
// };

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    {
      label: "默认",
      value: "normal",
    },
    {
      label: "单倍",
      value: "1",
    },
    {
      label: "1.15倍",
      value: "1.15",
    },
    {
      label: "1.5倍",
      value: "1.5",
    },
    {
      label: "双倍",
      value: "2",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("paragraph").lineHeight === value &&
                "bg-neutral-200/80"
            )}
          >
            <span className="test-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setIsEditing(false);
      setInputValue(newSize);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputBlur = () => {
    if (inputValue !== fontSize) {
      updateFontSize(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const incrementSize = () => {
    const newSize = parseInt(fontSize) + 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };
  const decrementSize = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };
  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrementSize}
        className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-11 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text "
        >
          {currentFontSize}
        </button>
      )}
      <button
        onClick={incrementSize}
        className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};
const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: "无序列表",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "有序列表",
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, isActive, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              isActive() && "bg-neutral-200/80"
            )}
          >
            <Icon className="size-4" />
            <span className="test-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    { label: "左对齐", value: "left", icon: AlignLeftIcon },
    { label: "居中", value: "center", icon: AlignCenterIcon },
    { label: "右对齐", value: "right", icon: AlignRightIcon },
    { label: "自适应", value: "justify", icon: AlignJustifyIcon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
            )}
          >
            <Icon />
            <span className="test-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    editor?.getAttributes("link").href || ""
  );

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "FILE";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
      input.click();
    };
  };
  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <ImageIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onUpload}>
          <UploadIcon className="size-4 mr-2" />
          上传
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
          <UploadIcon className="size-4 mr-2" />
          粘贴你的图片URL
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插入图片URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="http://example.com"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>插入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};
const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState(editor?.getAttributes("link").href || "");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="http://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(value);
            }
          }}
        />
        <Button onClick={() => onChange(value)}>应用</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("highlight").color || "#FFFFFF";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <HighlighterIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <SketchPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-h-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm ">
          <span className="text-xs" style={{ color: value }}>
            A
          </span>
          <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <SketchPicker color={value} onChange={onChange} className="" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const HeadingButton = () => {
  const { editor } = useEditorStore();

  const heading = [
    {
      label: "正文",
      value: 0,
      fontSize: "16px",
    },
    {
      label: "标题1",
      value: 1,
      fontSize: "28px",
    },
    {
      label: "标题2",
      value: 2,
      fontSize: "24px",
    },
    {
      label: "标题3",
      value: 3,
      fontSize: "20px",
    },
    {
      label: "标题4",
      value: 4,
      fontSize: "18px",
    },
    {
      label: "标题5",
      value: 5,
      fontSize: "16px",
    },
  ];
  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `标题${level}`;
      }
    }
    return "正文";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 min-h-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm  "
          onClick={() => console.log("font family")}
        >
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {heading.map(({ label, value, fontSize }) => (
          <button
            key={value}
            style={{ fontSize }}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .setHeading({ level: value as Level })
                  .run();
              }
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              ((value === 0 && !editor?.isActive("heading")) ||
                editor?.isActive("heading", { level: value })) &&
                "bg-neutral-200/80"
            )}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    {
      label: "Arial",
      value: "Arial",
    },
    {
      label: "Times New Roman",
      value: "Times New Roman",
    },
    {
      label: "Courier New",
      value: "Courier New",
    },
    {
      label: "Verdana",
      value: "Verdana",
    },
    {
      label: "Georgia",
      value: "Georgia",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm  "
          onClick={() => console.log("font family")}
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}
const ToolbarButton = ({
  icon: Icon,
  onClick,
  isActive,
}: ToolbarButtonProps) => {
  return (
    <button
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/8",
        isActive && "bg-neutral-200/80"
      )}
      onClick={onClick}
    >
      <Icon className="size-4" />
    </button>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();
  const params = useParams();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "print",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false"
          );
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive("bold"),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive("italic"),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: editor?.isActive("underline"),
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        onClick: () => editor?.chain().focus().addPendingComment().run(),
        isActive: editor?.isActive("libeblocksCommentMark"),
      },
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {/* <FormatBrushButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" /> */}
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontFamilyButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightColorButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LinkButton />
      <ImageButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <AskAIButton roomId={params.documentId as string} />
    </div>
  );
};
