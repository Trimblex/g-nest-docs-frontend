import { JSX } from "react";
import {
  // 基础文件
  FaFile,
  // 文档类
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFilePdf,
  FaFileAlt,
  FaBook,
  // 代码类
  FaFileCode,
  FaJs,
  FaPython,
  FaJava,
  FaHtml5,
  FaCss3,
  FaGitAlt,
  FaDocker,
  // 图片类
  FaFileImage,
  // 视频类
  FaFileVideo,
  // 音频类
  FaFileAudio,
  // 压缩包类
  FaFileArchive,
  // 数据类
  FaFileCsv,
  FaDatabase,
  // 系统类
  FaLinux,
  FaWindows,
  FaApple,
  FaTerminal,
  // 配置类
  FaCog,
  // 字体类
  FaFont,
  // 其他
  FaKey,
  FaEnvelope,
} from "react-icons/fa";
import { SiTypescript, SiJson, SiYaml } from "react-icons/si";

export const FileIcon = ({
  extension,
  className,
}: {
  extension?: string;
  className?: string;
}) => {
  const ext = extension?.toLowerCase() || "";

  // 按文件类型分类映射
  const IconMapper: { [key: string]: JSX.Element } = {
    /* ========= 文档类型 ========= */
    // Office 文档
    doc: <FaFileWord className={className} />,
    docx: <FaFileWord className={className} />,
    xls: <FaFileExcel className={className} />,
    xlsx: <FaFileExcel className={className} />,
    ppt: <FaFilePowerpoint className={className} />,
    pptx: <FaFilePowerpoint className={className} />,
    pdf: <FaFilePdf className={className} />,
    odt: <FaFileAlt className={className} />,

    // 文本文件
    txt: <FaFileAlt className={className} />,
    rtf: <FaFileAlt className={className} />,

    // 电子书
    epub: <FaBook className={className} />,
    mobi: <FaBook className={className} />,
    azw3: <FaBook className={className} />,

    /* ========= 编程/开发 ========= */
    // 前端
    js: <FaJs className={className} />,
    jsx: <FaJs className={className} />,
    ts: <SiTypescript className={className} />,
    tsx: <SiTypescript className={className} />,
    html: <FaHtml5 className={className} />,
    htm: <FaHtml5 className={className} />,
    css: <FaCss3 className={className} />,
    scss: <FaCss3 className={className} />,
    sass: <FaCss3 className={className} />,

    // 后端
    java: <FaJava className={className} />,
    py: <FaPython className={className} />,
    go: <FaFileCode className={className} />,
    rs: <FaFileCode className={className} />,
    php: <FaFileCode className={className} />,

    // 配置数据
    json: <SiJson className={className} />,
    yml: <SiYaml className={className} />,
    yaml: <SiYaml className={className} />,
    toml: <FaCog className={className} />,
    env: <FaCog className={className} />,
    ini: <FaCog className={className} />,

    // 脚本/命令行
    sh: <FaTerminal className={className} />,
    bat: <FaTerminal className={className} />,
    cmd: <FaTerminal className={className} />,
    ps1: <FaTerminal className={className} />,

    // 版本控制
    gitignore: <FaGitAlt className={className} />,
    gitmodules: <FaGitAlt className={className} />,
    dockerfile: <FaDocker className={className} />,

    // 构建工具
    lock: <FaFileCode className={className} />, // package-lock.json 等
    makefile: <FaFileCode className={className} />,

    /* ========= 媒体文件 ========= */
    // 图片
    jpg: <FaFileImage className={className} />,
    jpeg: <FaFileImage className={className} />,
    png: <FaFileImage className={className} />,
    gif: <FaFileImage className={className} />,
    webp: <FaFileImage className={className} />,
    bmp: <FaFileImage className={className} />,
    ico: <FaFileImage className={className} />,
    svg: <FaFileImage className={className} />,

    // 视频
    mp4: <FaFileVideo className={className} />,
    mov: <FaFileVideo className={className} />,
    avi: <FaFileVideo className={className} />,
    mkv: <FaFileVideo className={className} />,
    flv: <FaFileVideo className={className} />,
    webm: <FaFileVideo className={className} />,

    // 音频
    mp3: <FaFileAudio className={className} />,
    wav: <FaFileAudio className={className} />,
    flac: <FaFileAudio className={className} />,
    ogg: <FaFileAudio className={className} />,

    /* ========= 数据文件 ========= */
    csv: <FaFileCsv className={className} />,
    tsv: <FaFileCsv className={className} />,
    sql: <FaDatabase className={className} />,
    db: <FaDatabase className={className} />,

    /* ========= 压缩包 ========= */
    zip: <FaFileArchive className={className} />,
    rar: <FaFileArchive className={className} />,
    "7z": <FaFileArchive className={className} />,
    tar: <FaFileArchive className={className} />,
    gz: <FaFileArchive className={className} />,

    /* ========= 系统文件 ========= */
    exe: <FaWindows className={className} />,
    dmg: <FaApple className={className} />,
    appimage: <FaLinux className={className} />,
    deb: <FaLinux className={className} />,
    rpm: <FaLinux className={className} />,

    /* ========= 安全相关 ========= */
    pem: <FaKey className={className} />,
    crt: <FaKey className={className} />,
    key: <FaKey className={className} />,

    /* ========= 其他 ========= */
    email: <FaEnvelope className={className} />,
    eml: <FaEnvelope className={className} />,
    ttf: <FaFont className={className} />,
    otf: <FaFont className={className} />,
    woff: <FaFont className={className} />,
  };

  return IconMapper[ext] || <FaFile className={className} />; // 默认图标
};
