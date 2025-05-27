import { useCallback } from "react";
import mammoth from "mammoth";
import { toast } from "sonner";

interface WordImporterProps {
  onConvert: (html: string) => void;
  acceptedFileType?: string;
}

const WordImporter = ({
  onConvert,
  acceptedFileType = ".docx",
}: WordImporterProps) => {
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      // 验证文件类型
      if (!file.name.endsWith(acceptedFileType)) {
        toast.error(`仅支持 ${acceptedFileType} 格式文件`);
        return;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();

        // 使用 mammoth 转换 Word 文档
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          { includeEmbeddedStyleMap: true }
        );

        // 调用父组件回调
        onConvert(result.value);

        // 可选：处理文档中的警告信息
        if (result.messages.length > 0) {
          toast.error("转换警告:" + result.messages);
        }
      } catch (error) {
        toast.error("文件转换失败");
        console.error("文件转换失败:", error);
      } finally {
        // 清空 input 以允许重复上传相同文件
        event.target.value = "";
      }
    },
    [onConvert, acceptedFileType]
  );

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-gray-50 text-blue-600 transition-colors">
        <svg
          className="w-8 h-8 mb-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="text-sm">选择 Word 文件</span>
        <input
          type="FILE"
          className="hidden"
          accept={acceptedFileType}
          onChange={handleFileUpload}
        />
      </label>

      <p className="text-sm text-gray-500 text-center">
        支持 {acceptedFileType.toUpperCase()} 格式文件
      </p>
    </div>
  );
};

export default WordImporter;
