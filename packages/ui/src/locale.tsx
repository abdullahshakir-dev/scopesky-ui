"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

/*
 * Every piece of text the components write on their own (button labels, empty
 * states, screen-reader labels …). Wrap the app in <LocaleProvider messages={arMessages}>
 * for Arabic, or pass your own partial set to change single strings.
 * Text you pass as a prop (a label, a title …) always wins over these.
 */
export interface Messages {
  /* shared */
  cancel: string;
  close: string;
  save: string;
  delete: string;
  remove: (name: string) => string;
  noMatches: string;
  loading: string;
  copy: string;
  copied: string;
  showMore: string;
  showLess: string;

  /* fields */
  showPassword: string;
  hidePassword: string;
  decrease: string;
  increase: string;
  numberOutOfRange: (min: number, max: number) => string;
  search: string;
  openSearch: string;
  clearSearch: string;
  chooseOption: string;
  chooseOptions: string;
  typeToFilter: string;
  clearSelection: string;
  clearAllSelected: string;
  toggleOn: string;
  toggleOff: string;
  sliderValue: (label: string) => string;
  months: readonly string[];
  /** Monday first. */
  weekdaysShort: readonly string[];
  previousMonth: string;
  nextMonth: string;
  openCalendar: string;
  datePlaceholder: string;
  timePlaceholder: (hour12: boolean) => string;
  timeInvalid: (hour12: boolean) => string;
  am: string;
  pm: string;
  amPm: string;
  timeZone: string;
  uploadTitle: string;
  chooseFiles: string;
  dropFilesHint: string;
  fileTooLarge: (maxSize: string) => string;
  fileTypeNotAllowed: string;
  uploading: string;
  uploaded: string;
  otpLabel: string;
  otpDigit: (index: number, length: number) => string;
  otpHint: (length: number) => string;

  /* data */
  selectAllRows: string;
  selectRow: (id: string) => string;
  itemsSelected: (count: number) => string;
  filterTable: string;
  filterPlaceholder: string;
  noResultsFor: (query: string) => string;
  noData: string;
  copyCode: string;
  previousSlide: string;
  nextSlide: string;
  slideOf: (index: number, total: number) => string;
  carousel: string;
  emptyList: string;

  /* feedback */
  closeNotification: string;
  finished: string;
  error: string;
  dismiss: (name: string) => string;
  aiExplained: string;
  aiShowExplanation: string;
  stepComplete: string;
  stepCurrent: string;
  stepIncomplete: string;
  stepInvalid: string;

  /* navigation */
  breadcrumb: string;
  itemsPerPage: string;
  itemRange: (from: number, to: number, total: number) => string;
  pageNumber: string;
  ofPages: (pages: number) => string;
  previousPage: string;
  nextPage: string;
  page: (n: number) => string;
  pagination: string;
  options: string;
  contextMenu: string;
  mainNavigation: string;
  sideNavigation: string;
  openMenu: string;
  closeMenu: string;
  commandSearch: string;
  commandPlaceholder: string;
  commandHint: string;
  commandRun: string;

  /* overlays */
  resizePanels: string;
  scrollableRegion: string;
  hide: string;

  /* conversation */
  conversation: string;
  copyMessage: string;
  helpful: string;
  jumpToLatest: string;
  stepsDone: (done: number, total: number) => string;
}

const fmtBytes = (n: number) => (n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)} MB` : `${Math.round(n / 1000)} KB`);
export { fmtBytes as formatBytes };

export const enMessages: Messages = {
  cancel: "Cancel",
  close: "Close",
  save: "Save",
  delete: "Delete",
  remove: (name) => `Remove ${name}`,
  noMatches: "No matches. Try another word.",
  loading: "Loading",
  copy: "Copy",
  copied: "Copied",
  showMore: "Show more",
  showLess: "Show less",

  showPassword: "Show password",
  hidePassword: "Hide password",
  decrease: "Decrease",
  increase: "Increase",
  numberOutOfRange: (min, max) => `Enter a number from ${min} to ${max}.`,
  search: "Search",
  openSearch: "Open search",
  clearSearch: "Clear search",
  chooseOption: "Choose an option",
  chooseOptions: "Choose options",
  typeToFilter: "Type to filter",
  clearSelection: "Clear selection",
  clearAllSelected: "Clear all selected items",
  toggleOn: "On",
  toggleOff: "Off",
  sliderValue: (label) => `${label} value`,
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  weekdaysShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  previousMonth: "Previous month",
  nextMonth: "Next month",
  openCalendar: "Open calendar",
  datePlaceholder: "dd/mm/yyyy",
  timePlaceholder: () => "hh:mm",
  timeInvalid: (h12) => (h12 ? "Use hh:mm, for example 09:30." : "Use hh:mm, for example 14:30."),
  am: "AM",
  pm: "PM",
  amPm: "AM or PM",
  timeZone: "Time zone",
  uploadTitle: "Upload files",
  chooseFiles: "Choose files",
  dropFilesHint: "or drag and drop them here",
  fileTooLarge: (max) => `File is over ${max}. Choose a smaller file.`,
  fileTypeNotAllowed: "This file type isn't supported.",
  uploading: "Uploading",
  uploaded: "Uploaded",
  otpLabel: "Verification code",
  otpDigit: (i, n) => `Digit ${i} of ${n}`,
  otpHint: (n) => `Enter the ${n}-digit code we sent you.`,

  selectAllRows: "Select all rows",
  selectRow: (id) => `Select ${id}`,
  itemsSelected: (n) => `${n} item${n === 1 ? "" : "s"} selected`,
  filterTable: "Filter table",
  filterPlaceholder: "Filter",
  noResultsFor: (q) => `Nothing matches “${q}”. Check the spelling or clear the filter.`,
  noData: "No data yet.",
  copyCode: "Copy code",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  slideOf: (i, n) => `${i} of ${n}`,
  carousel: "Carousel",
  emptyList: "Nothing here yet.",

  closeNotification: "Close notification",
  finished: "Finished",
  error: "Error",
  dismiss: (name) => `Dismiss ${name}`,
  aiExplained: "AI explained",
  aiShowExplanation: "AI: show explanation",
  stepComplete: "Complete",
  stepCurrent: "Current",
  stepIncomplete: "Not started",
  stepInvalid: "Has an error",

  breadcrumb: "Breadcrumb",
  itemsPerPage: "Items per page:",
  itemRange: (from, to, total) => `${from}–${to} of ${total} items`,
  pageNumber: "Page number",
  ofPages: (n) => `of ${n} page${n === 1 ? "" : "s"}`,
  previousPage: "Previous page",
  nextPage: "Next page",
  page: (n) => `Page ${n}`,
  pagination: "Pagination",
  options: "Options",
  contextMenu: "Context menu",
  mainNavigation: "Main",
  sideNavigation: "Side navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  commandSearch: "Command search",
  commandPlaceholder: "Type a command or search…",
  commandHint: "Use arrow keys to move",
  commandRun: "to run",

  resizePanels: "Resize panels",
  scrollableRegion: "Scrollable region",
  hide: "Hide",

  conversation: "Conversation",
  copyMessage: "Copy message",
  helpful: "Helpful",
  jumpToLatest: "Jump to latest",
  stepsDone: (d, n) => `Checked ${d} of ${n} steps`,
};

export const arMessages: Messages = {
  cancel: "إلغاء",
  close: "إغلاق",
  save: "حفظ",
  delete: "حذف",
  remove: (name) => `إزالة ${name}`,
  noMatches: "لا نتائج مطابقة. جرّب كلمة أخرى.",
  loading: "جارٍ التحميل",
  copy: "نسخ",
  copied: "تم النسخ",
  showMore: "عرض المزيد",
  showLess: "عرض أقل",

  showPassword: "إظهار كلمة المرور",
  hidePassword: "إخفاء كلمة المرور",
  decrease: "إنقاص",
  increase: "زيادة",
  numberOutOfRange: (min, max) => `أدخل رقماً من ${min} إلى ${max}.`,
  search: "بحث",
  openSearch: "فتح البحث",
  clearSearch: "مسح البحث",
  chooseOption: "اختر خياراً",
  chooseOptions: "اختر خيارات",
  typeToFilter: "اكتب للتصفية",
  clearSelection: "مسح الاختيار",
  clearAllSelected: "مسح كل العناصر المختارة",
  toggleOn: "مفعّل",
  toggleOff: "متوقف",
  sliderValue: (label) => `قيمة ${label}`,
  months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  weekdaysShort: ["ن", "ث", "ر", "خ", "ج", "س", "ح"],
  previousMonth: "الشهر السابق",
  nextMonth: "الشهر التالي",
  openCalendar: "فتح التقويم",
  datePlaceholder: "يوم/شهر/سنة",
  timePlaceholder: () => "س:د",
  timeInvalid: (h12) => (h12 ? "استخدم الصيغة س:د، مثل 09:30." : "استخدم الصيغة س:د، مثل 14:30."),
  am: "ص",
  pm: "م",
  amPm: "صباحاً أو مساءً",
  timeZone: "المنطقة الزمنية",
  uploadTitle: "رفع الملفات",
  chooseFiles: "اختر الملفات",
  dropFilesHint: "أو اسحبها وأفلتها هنا",
  fileTooLarge: (max) => `حجم الملف أكبر من ${max}. اختر ملفاً أصغر.`,
  fileTypeNotAllowed: "نوع الملف هذا غير مدعوم.",
  uploading: "جارٍ الرفع",
  uploaded: "تم الرفع",
  otpLabel: "رمز التحقق",
  otpDigit: (i, n) => `الخانة ${i} من ${n}`,
  otpHint: (n) => `أدخل الرمز المكوّن من ${n} أرقام الذي أرسلناه إليك.`,

  selectAllRows: "تحديد كل الصفوف",
  selectRow: (id) => `تحديد ${id}`,
  itemsSelected: (n) => `تم تحديد ${n}`,
  filterTable: "تصفية الجدول",
  filterPlaceholder: "تصفية",
  noResultsFor: (q) => `لا شيء يطابق “${q}”. تحقق من الإملاء أو امسح التصفية.`,
  noData: "لا توجد بيانات بعد.",
  copyCode: "نسخ الشيفرة",
  previousSlide: "الشريحة السابقة",
  nextSlide: "الشريحة التالية",
  slideOf: (i, n) => `${i} من ${n}`,
  carousel: "عرض شرائح",
  emptyList: "لا شيء هنا بعد.",

  closeNotification: "إغلاق الإشعار",
  finished: "اكتمل",
  error: "خطأ",
  dismiss: (name) => `إزالة ${name}`,
  aiExplained: "شرح الذكاء الاصطناعي",
  aiShowExplanation: "ذكاء اصطناعي: عرض الشرح",
  stepComplete: "مكتملة",
  stepCurrent: "الحالية",
  stepIncomplete: "لم تبدأ",
  stepInvalid: "فيها خطأ",

  breadcrumb: "مسار التنقل",
  itemsPerPage: "عناصر لكل صفحة:",
  itemRange: (from, to, total) => `${from}–${to} من ${total} عنصر`,
  pageNumber: "رقم الصفحة",
  ofPages: (n) => `من ${n} صفحة`,
  previousPage: "الصفحة السابقة",
  nextPage: "الصفحة التالية",
  page: (n) => `الصفحة ${n}`,
  pagination: "ترقيم الصفحات",
  options: "خيارات",
  contextMenu: "قائمة السياق",
  mainNavigation: "التنقل الرئيسي",
  sideNavigation: "التنقل الجانبي",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  commandSearch: "البحث في الأوامر",
  commandPlaceholder: "اكتب أمراً أو ابحث…",
  commandHint: "استخدم الأسهم للتنقل",
  commandRun: "للتنفيذ",

  resizePanels: "تغيير حجم الألواح",
  scrollableRegion: "منطقة قابلة للتمرير",
  hide: "إخفاء",

  conversation: "المحادثة",
  copyMessage: "نسخ الرسالة",
  helpful: "مفيد",
  jumpToLatest: "الانتقال إلى الأحدث",
  stepsDone: (d, n) => `تم فحص ${d} من ${n} خطوات`,
};

const MessagesContext = createContext<Messages>(enMessages);

/** Sets the built-in text for every component inside it. Nest providers to override parts. */
export function LocaleProvider({ messages, children }: { messages?: Partial<Messages>; children: ReactNode }) {
  const parent = useContext(MessagesContext);
  const value = useMemo(() => ({ ...parent, ...messages }), [parent, messages]);
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

/** The text components use. English unless a LocaleProvider says otherwise. */
export function useMessages(): Messages {
  return useContext(MessagesContext);
}
