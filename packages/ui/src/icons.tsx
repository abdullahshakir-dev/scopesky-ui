import { createElement, type JSX, type SVGProps } from "react";
import { iconData, iconNames, type IconName } from "./icon-data.js";
import { cn } from "./utils.js";

/*
 * ScopeSky icons. The source files are plain SVGs in packages/ui/icons
 * (24 × 24 grid, 2px stroke, round caps and joins). The build turns them into
 * icon-data.ts, so the icons ship inside the package and need no public folder.
 */

export { iconNames, type IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

const camel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function Icon({ name, size = 24, strokeWidth = 2, className, ...rest }: IconProps) {
  const labelled = rest["aria-label"] || rest["aria-labelledby"];
  const shapes = iconData[name] ?? [];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {shapes.map(([tag, attrs], i) => createElement(tag, { key: i, ...Object.fromEntries(Object.entries(attrs).map(([k, v]) => [camel(k), v])) }))}
    </svg>
  );
}

export type IconComponent = (props: Omit<IconProps, "name">) => JSX.Element;

function make(name: IconName): IconComponent {
  const C = (props: Omit<IconProps, "name">) => <Icon name={name} {...props} />;
  C.displayName = name;
  return C;
}

export const AlertTriangle = make("alert-triangle");
export const Archive = make("archive");
export const ArrowDown = make("arrow-down");
export const ArrowLeft = make("arrow-left");
export const ArrowRight = make("arrow-right");
export const ArrowUp = make("arrow-up");
export const ArrowUpDown = make("arrow-up-down");
export const Bell = make("bell");
export const Bold = make("bold");
export const BookOpen = make("book-open");
export const Box = make("box");
export const Boxes = make("boxes");
export const Calendar = make("calendar");
export const CalendarDays = make("calendar-days");
export const Check = make("check");
export const CheckCircle2 = make("check-circle-2");
export const ChevronDown = make("chevron-down");
export const ChevronLeft = make("chevron-left");
export const ChevronRight = make("chevron-right");
export const ChevronUp = make("chevron-up");
export const CircleAlert = make("circle-alert");
export const CircleDashed = make("circle-dashed");
export const CircleX = make("circle-x");
export const ClipboardList = make("clipboard-list");
export const Clock = make("clock");
export const Code = make("code");
export const Copy = make("copy");
export const CornerDownLeft = make("corner-down-left");
export const CreditCard = make("credit-card");
export const Database = make("database");
export const Download = make("download");
export const ExternalLink = make("external-link");
export const Eye = make("eye");
export const EyeOff = make("eye-off");
export const File = make("file");
export const FileCheck = make("file-check");
export const FileSearch = make("file-search");
export const FileText = make("file-text");
export const Filter = make("filter");
export const Folder = make("folder");
export const FolderOpen = make("folder-open");
export const FolderPlus = make("folder-plus");
export const Globe = make("globe");
export const Grid3x3 = make("grid-3x3");
export const GripVertical = make("grip-vertical");
export const History = make("history");
export const House = make("house");
export const ImageIcon = make("image");
export const Inbox = make("inbox");
export const Info = make("info");
export const Italic = make("italic");
export const Languages = make("languages");
export const Layers = make("layers");
export const LayoutGrid = make("layout-grid");
export const LayoutTemplate = make("layout-template");
export const Lightbulb = make("lightbulb");
export const Link = make("link");
export const List = make("list");
export const Loader2 = make("loader-2");
export const Lock = make("lock");
export const LogOut = make("log-out");
export const Mail = make("mail");
export const Maximize2 = make("maximize-2");
export const Menu = make("menu");
export const Minimize2 = make("minimize-2");
export const Minus = make("minus");
export const Moon = make("moon");
export const MoreHorizontal = make("more-horizontal");
export const MoreVertical = make("more-vertical");
export const Palette = make("palette");
export const PanelLeft = make("panel-left");
export const Paperclip = make("paperclip");
export const Plus = make("plus");
export const RotateCcw = make("rotate-ccw");
export const Search = make("search");
export const SearchX = make("search-x");
export const Settings = make("settings");
export const Share2 = make("share-2");
export const ShieldCheck = make("shield-check");
export const Smile = make("smile");
export const Sparkles = make("sparkles");
export const SquarePen = make("square-pen");
export const Star = make("star");
export const Sun = make("sun");
export const Tag = make("tag");
export const ThumbsUp = make("thumbs-up");
export const Trash2 = make("trash-2");
export const Underline = make("underline");
export const Upload = make("upload");
export const User = make("user");
export const UserCircle = make("user-circle");
export const UserPlus = make("user-plus");
export const Users = make("users");
export const Wifi = make("wifi");
export const X = make("x");
