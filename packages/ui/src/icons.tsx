import { createElement, type JSX, type SVGProps } from "react";
import * as d from "./icon-data.js";
import { iconData, iconNames, type IconName, type IconShape } from "./icon-data.js";
import { cn } from "./utils.js";

/*
 * Icons from Lucide (https://lucide.dev), ISC License; see THIRD_PARTY_NOTICES.md.
 * The source files are plain SVGs in packages/ui/icons (24 × 24 grid, 2px
 * stroke, round caps and joins). The build turns them into icon-data.ts, one
 * constant per icon, so an app only bundles the icons it imports by name.
 * <Icon name="…"> looks names up at runtime and so includes every icon.
 */

export { iconNames, type IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

const camel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function Svg({ shapes, size = 24, strokeWidth = 2, className, ...rest }: Omit<IconProps, "name"> & { shapes: readonly IconShape[] }) {
  const labelled = rest["aria-label"] || rest["aria-labelledby"];
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

/** Any icon by name. Handy, but it bundles every icon; prefer the named components (Search, Plus …). */
export function Icon({ name, ...rest }: IconProps) {
  return <Svg shapes={iconData[name] ?? []} {...rest} />;
}

export type IconComponent = ((props: Omit<IconProps, "name">) => JSX.Element) & { displayName?: string };

function make(name: IconName, shapes: readonly IconShape[]): IconComponent {
  const C: IconComponent = (props) => <Svg shapes={shapes} {...props} />;
  C.displayName = name;
  return C;
}

export const AlertTriangle = /*#__PURE__*/ make("alert-triangle", d.i_alert_triangle);
export const Archive = /*#__PURE__*/ make("archive", d.i_archive);
export const ArrowDown = /*#__PURE__*/ make("arrow-down", d.i_arrow_down);
export const ArrowLeft = /*#__PURE__*/ make("arrow-left", d.i_arrow_left);
export const ArrowRight = /*#__PURE__*/ make("arrow-right", d.i_arrow_right);
export const ArrowUp = /*#__PURE__*/ make("arrow-up", d.i_arrow_up);
export const ArrowUpDown = /*#__PURE__*/ make("arrow-up-down", d.i_arrow_up_down);
export const Bell = /*#__PURE__*/ make("bell", d.i_bell);
export const Bold = /*#__PURE__*/ make("bold", d.i_bold);
export const BookOpen = /*#__PURE__*/ make("book-open", d.i_book_open);
export const Box = /*#__PURE__*/ make("box", d.i_box);
export const Boxes = /*#__PURE__*/ make("boxes", d.i_boxes);
export const Calendar = /*#__PURE__*/ make("calendar", d.i_calendar);
export const CalendarDays = /*#__PURE__*/ make("calendar-days", d.i_calendar_days);
export const Check = /*#__PURE__*/ make("check", d.i_check);
export const CheckCircle2 = /*#__PURE__*/ make("check-circle-2", d.i_check_circle_2);
export const ChevronDown = /*#__PURE__*/ make("chevron-down", d.i_chevron_down);
export const ChevronLeft = /*#__PURE__*/ make("chevron-left", d.i_chevron_left);
export const ChevronRight = /*#__PURE__*/ make("chevron-right", d.i_chevron_right);
export const ChevronUp = /*#__PURE__*/ make("chevron-up", d.i_chevron_up);
export const CircleAlert = /*#__PURE__*/ make("circle-alert", d.i_circle_alert);
export const CircleDashed = /*#__PURE__*/ make("circle-dashed", d.i_circle_dashed);
export const CircleX = /*#__PURE__*/ make("circle-x", d.i_circle_x);
export const ClipboardList = /*#__PURE__*/ make("clipboard-list", d.i_clipboard_list);
export const Clock = /*#__PURE__*/ make("clock", d.i_clock);
export const Code = /*#__PURE__*/ make("code", d.i_code);
export const Copy = /*#__PURE__*/ make("copy", d.i_copy);
export const CornerDownLeft = /*#__PURE__*/ make("corner-down-left", d.i_corner_down_left);
export const CreditCard = /*#__PURE__*/ make("credit-card", d.i_credit_card);
export const Database = /*#__PURE__*/ make("database", d.i_database);
export const Download = /*#__PURE__*/ make("download", d.i_download);
export const ExternalLink = /*#__PURE__*/ make("external-link", d.i_external_link);
export const Eye = /*#__PURE__*/ make("eye", d.i_eye);
export const EyeOff = /*#__PURE__*/ make("eye-off", d.i_eye_off);
export const File = /*#__PURE__*/ make("file", d.i_file);
export const FileCheck = /*#__PURE__*/ make("file-check", d.i_file_check);
export const FileSearch = /*#__PURE__*/ make("file-search", d.i_file_search);
export const FileText = /*#__PURE__*/ make("file-text", d.i_file_text);
export const Filter = /*#__PURE__*/ make("filter", d.i_filter);
export const Folder = /*#__PURE__*/ make("folder", d.i_folder);
export const FolderOpen = /*#__PURE__*/ make("folder-open", d.i_folder_open);
export const FolderPlus = /*#__PURE__*/ make("folder-plus", d.i_folder_plus);
export const Globe = /*#__PURE__*/ make("globe", d.i_globe);
export const Grid3x3 = /*#__PURE__*/ make("grid-3x3", d.i_grid_3x3);
export const GripVertical = /*#__PURE__*/ make("grip-vertical", d.i_grip_vertical);
export const History = /*#__PURE__*/ make("history", d.i_history);
export const House = /*#__PURE__*/ make("house", d.i_house);
export const ImageIcon = /*#__PURE__*/ make("image", d.i_image);
export const Inbox = /*#__PURE__*/ make("inbox", d.i_inbox);
export const Info = /*#__PURE__*/ make("info", d.i_info);
export const Italic = /*#__PURE__*/ make("italic", d.i_italic);
export const Languages = /*#__PURE__*/ make("languages", d.i_languages);
export const Layers = /*#__PURE__*/ make("layers", d.i_layers);
export const LayoutGrid = /*#__PURE__*/ make("layout-grid", d.i_layout_grid);
export const LayoutTemplate = /*#__PURE__*/ make("layout-template", d.i_layout_template);
export const Lightbulb = /*#__PURE__*/ make("lightbulb", d.i_lightbulb);
export const Link = /*#__PURE__*/ make("link", d.i_link);
export const List = /*#__PURE__*/ make("list", d.i_list);
export const Loader2 = /*#__PURE__*/ make("loader-2", d.i_loader_2);
export const Lock = /*#__PURE__*/ make("lock", d.i_lock);
export const LogOut = /*#__PURE__*/ make("log-out", d.i_log_out);
export const Mail = /*#__PURE__*/ make("mail", d.i_mail);
export const Maximize2 = /*#__PURE__*/ make("maximize-2", d.i_maximize_2);
export const Menu = /*#__PURE__*/ make("menu", d.i_menu);
export const Minimize2 = /*#__PURE__*/ make("minimize-2", d.i_minimize_2);
export const Minus = /*#__PURE__*/ make("minus", d.i_minus);
export const Moon = /*#__PURE__*/ make("moon", d.i_moon);
export const MoreHorizontal = /*#__PURE__*/ make("more-horizontal", d.i_more_horizontal);
export const MoreVertical = /*#__PURE__*/ make("more-vertical", d.i_more_vertical);
export const Palette = /*#__PURE__*/ make("palette", d.i_palette);
export const PanelLeft = /*#__PURE__*/ make("panel-left", d.i_panel_left);
export const Paperclip = /*#__PURE__*/ make("paperclip", d.i_paperclip);
export const Plus = /*#__PURE__*/ make("plus", d.i_plus);
export const RotateCcw = /*#__PURE__*/ make("rotate-ccw", d.i_rotate_ccw);
export const Search = /*#__PURE__*/ make("search", d.i_search);
export const SearchX = /*#__PURE__*/ make("search-x", d.i_search_x);
export const Settings = /*#__PURE__*/ make("settings", d.i_settings);
export const Share2 = /*#__PURE__*/ make("share-2", d.i_share_2);
export const ShieldCheck = /*#__PURE__*/ make("shield-check", d.i_shield_check);
export const Smile = /*#__PURE__*/ make("smile", d.i_smile);
export const Sparkles = /*#__PURE__*/ make("sparkles", d.i_sparkles);
export const SquarePen = /*#__PURE__*/ make("square-pen", d.i_square_pen);
export const Star = /*#__PURE__*/ make("star", d.i_star);
export const Sun = /*#__PURE__*/ make("sun", d.i_sun);
export const Tag = /*#__PURE__*/ make("tag", d.i_tag);
export const ThumbsUp = /*#__PURE__*/ make("thumbs-up", d.i_thumbs_up);
export const Trash2 = /*#__PURE__*/ make("trash-2", d.i_trash_2);
export const Underline = /*#__PURE__*/ make("underline", d.i_underline);
export const Upload = /*#__PURE__*/ make("upload", d.i_upload);
export const User = /*#__PURE__*/ make("user", d.i_user);
export const UserCircle = /*#__PURE__*/ make("user-circle", d.i_user_circle);
export const UserPlus = /*#__PURE__*/ make("user-plus", d.i_user_plus);
export const Users = /*#__PURE__*/ make("users", d.i_users);
export const Wifi = /*#__PURE__*/ make("wifi", d.i_wifi);
export const X = /*#__PURE__*/ make("x", d.i_x);
