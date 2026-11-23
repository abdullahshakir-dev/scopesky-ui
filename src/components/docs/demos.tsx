"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  Bold,
  Calendar,
  CreditCard,
  Download,
  FileSearch,
  Grid3x3,
  Inbox,
  Italic,
  Mail,
  Plus,
  Search as SearchIcon,
  Settings,
  Share2,
  Smile,
  Trash2,
  Underline,
  User,
  Wifi,
} from "@scopesky/ui/icons";
import { Button, ButtonGroup, CopyButton, Link, ToggleButton, type ButtonKind, type ButtonSize } from "@scopesky/ui/button";
import {
  Checkbox,
  ComboBox,
  ContentSwitcher,
  DatePicker,
  Dropdown,
  FileUploader,
  FluidInput,
  FormGroup,
  InputGroup,
  InputOTP,
  MultiSelect,
  NumberInput,
  PasswordInput,
  RadioGroup,
  Search,
  Select,
  Slider,
  TextArea,
  TextInput,
  TimePicker,
  Toggle,
} from "@scopesky/ui/fields";
import {
  AILabel,
  DefinitionTooltip,
  Empty,
  InlineLoading,
  Loading,
  Modal,
  Notification,
  Popover,
  ProgressBar,
  ProgressIndicator,
  Skeleton,
  Tag,
  Toggletip,
  Tooltip,
  type Kind,
  type TagType,
} from "@scopesky/ui/feedback";
import {
  Breadcrumb,
  Command,
  ContextMenuArea,
  MenuButton,
  Menubar,
  NavigationMenu,
  OverflowMenu,
  Pagination,
  PaginationNav,
  Tabs,
  UIShell,
  UIShellAction,
} from "@scopesky/ui/navigation";
import {
  Accordion,
  Attachment,
  Avatar,
  AvatarGroup,
  BarChart,
  Carousel,
  CodeSnippet,
  ContainedList,
  DataTable,
  Item,
  Kbd,
  List,
  StructuredList,
  Tile,
  TreeView,
} from "@scopesky/ui/data";
import { requestColumns, requests } from "./sample-data";
import { AlertDialog, AspectRatio, Collapsible, Drawer, HoverCard, Resizable, ScrollArea, Separator, Sheet } from "@scopesky/ui/overlays";
import { Bubble, Marker, Message, MessageScroller, Trace } from "@scopesky/ui/conversation";

export type Control =
  | { name: string; type: "select"; options: string[]; default: string }
  | { name: string; type: "boolean"; default: boolean; label?: string }
  | { name: string; type: "text"; default: string; label?: string };

export type Values = Record<string, string | boolean>;
export interface Ctx {
  ar: boolean;
  t: (en: string, ar: string) => string;
}

export interface Demo {
  controls?: Control[];
  render: (v: Values, ctx: Ctx) => ReactNode;
  /** preview canvas alignment */
  layout?: "center" | "start" | "stretch";
  minH?: number;
}

/* ---------- stateful helpers for demos that need local state ---------- */

/** Local state for a demo. `name` is what the generated code calls it (const [name, setName]). */
function State<T>({ initial, children }: { name: string; initial: T; children: (v: T, set: (v: T) => void) => ReactNode }) {
  const [v, set] = useState(initial);
  return <>{children(v, set)}</>;
}

const faq = (t: Ctx["t"]) => [
  { title: t("How do I reset my router?", "كيف أعيد تشغيل جهاز الراوتر؟"), body: t("Hold the reset button for 10 seconds, then wait two minutes for the lights to settle.", "اضغط زر إعادة الضبط لمدة 10 ثوانٍ، ثم انتظر دقيقتين حتى تستقر الأضواء.") },
  { title: t("Which payment methods are accepted?", "ما طرق الدفع المقبولة؟"), body: t("Cash at any branch, bank transfer and approved e-wallets.", "نقداً في أي فرع، أو بتحويل مصرفي، أو عبر المحافظ الإلكترونية المعتمدة.") },
  { title: t("How can I contact support?", "كيف أتواصل مع الدعم؟"), body: t("Call the support line any time, or open a request from your account.", "اتصل بخط الدعم في أي وقت، أو افتح طلباً من حسابك.") },
];

const menuItems = (t: Ctx["t"]) => [
  { label: t("Edit", "تعديل") },
  { label: t("Duplicate", "تكرار") },
  { label: t("Share", "مشاركة") },
  { label: "div", divider: true },
  { label: t("Delete", "حذف"), danger: true },
];

/* ---------- the registry ---------- */

export const demos: Record<string, Demo> = {
  /* Actions */
  button: {
    controls: [
      { name: "label", type: "text", default: "Save changes", label: "Label" },
      { name: "kind", type: "select", options: ["primary", "secondary", "tertiary", "ghost", "danger", "danger--tertiary", "danger--ghost"], default: "primary" },
      { name: "size", type: "select", options: ["sm", "md", "lg", "xl"], default: "lg" },
      { name: "withIcon", type: "boolean", default: false, label: "With icon" },
      { name: "iconOnly", type: "boolean", default: false },
      { name: "disabled", type: "boolean", default: false },
    ],
    render: (v, { t }) => (
      <Button kind={v.kind as ButtonKind} size={v.size as ButtonSize} disabled={!!v.disabled} icon={v.withIcon || v.iconOnly ? <Plus /> : undefined} iconOnly={!!v.iconOnly}>
        {v.label === "Save changes" ? t("Save changes", "حفظ التغييرات") : (v.label as string)}
      </Button>
    ),
  },
  "icon-button": {
    controls: [
      { name: "kind", type: "select", options: ["primary", "secondary", "ghost", "tertiary"], default: "ghost" },
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
    ],
    render: (v, { t }) => (
      <div className="flex gap-2">
        {[
          { i: <Download />, l: t("Download", "تنزيل") },
          { i: <Share2 />, l: t("Share", "مشاركة") },
          { i: <Settings />, l: t("Settings", "الإعدادات") },
        ].map((b) => (
          <Tooltip key={b.l} label={b.l}>
            <Button kind={v.kind as ButtonKind} size={v.size as ButtonSize} iconOnly icon={b.i}>
              {b.l}
            </Button>
          </Tooltip>
        ))}
      </div>
    ),
  },
  link: {
    controls: [{ name: "inline", type: "boolean", default: false }],
    render: (v, { t }) =>
      v.inline ? (
        <p className="max-w-sm text-sm text-ink">
          {t("Read the ", "اقرأ ")}
          <Link inline>{t("service terms", "شروط الخدمة")}</Link>
          {t(" before you sign the contract.", " قبل توقيع العقد.")}
        </p>
      ) : (
        <Link>{t("View all services", "عرض كل الخدمات")}</Link>
      ),
  },
  "menu-button": {
    render: (_, { t }) => <MenuButton label={t("Actions", "إجراءات")} items={[{ label: t("Export as CSV", "تصدير CSV") }, { label: t("Export as PDF", "تصدير PDF") }, { label: t("Print", "طباعة") }]} />,
    minH: 260,
    layout: "start",
  },
  "overflow-menu": {
    render: (_, { t }) => (
      <div className="flex w-72 items-center justify-between bg-layer ps-4">
        <span className="font-mono text-[13px] text-ink">SR-20481</span>
        <OverflowMenu items={menuItems(t)} label={t("Request options", "خيارات الطلب")} />
      </div>
    ),
    minH: 280,
    layout: "start",
  },
  "copy-button": {
    render: (_, { t }) => (
      <div className="flex items-center gap-2 bg-layer ps-4">
        <span className="font-mono text-sm text-ink">SR-20481</span>
        <CopyButton value="SR-20481" label={t("Copy request number", "نسخ رقم الطلب")} />
      </div>
    ),
  },
  "button-group": {
    render: (_, { t }) => <State name="range" initial={t("Week", "أسبوع")}>{(v, s) => <ButtonGroup label={t("Range", "المدة")} options={[t("Day", "يوم"), t("Week", "أسبوع"), t("Month", "شهر")]} value={v} onValueChange={s} />}</State>,
  },
  "toggle-button": {
    render: (_, { t }) => (
      <State name="format" initial={{ b: true, i: false, u: false }}>
        {(v, s) => (
          <div className="flex gap-1" role="toolbar" aria-label={t("Text formatting", "تنسيق النص")}>
            <ToggleButton label={t("Bold", "غامق")} pressed={v.b} onPressedChange={(b) => s({ ...v, b })}>
              <Bold />
            </ToggleButton>
            <ToggleButton label={t("Italic", "مائل")} pressed={v.i} onPressedChange={(i) => s({ ...v, i })}>
              <Italic />
            </ToggleButton>
            <ToggleButton label={t("Underline", "تسطير")} pressed={v.u} onPressedChange={(u) => s({ ...v, u })}>
              <Underline />
            </ToggleButton>
          </div>
        )}
      </State>
    ),
  },

  /* Inputs */
  "text-input": {
    controls: [
      { name: "label", type: "text", default: "Email address" },
      { name: "placeholder", type: "text", default: "name@example.com" },
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "invalid", type: "boolean", default: false },
      { name: "warn", type: "boolean", default: false },
      { name: "disabled", type: "boolean", default: false },
    ],
    render: (v, { t }) => (
      <div className="w-full max-w-xs">
        <TextInput
          label={v.label === "Email address" ? t("Email address", "البريد الإلكتروني") : (v.label as string)}
          placeholder={v.placeholder as string}
          size={v.size as "sm" | "md" | "lg"}
          disabled={!!v.disabled}
          helper={t("We send receipts to this address.", "نرسل الإيصالات إلى هذا العنوان.")}
          invalid={!!v.invalid && t("Enter an email address like name@example.com.", "أدخل بريداً إلكترونياً مثل name@example.com.")}
          warn={!!v.warn && t("This address is on a free domain. Use a work email if you have one.", "هذا العنوان من نطاق مجاني. استخدم بريد العمل إن وُجد.")}
        />
      </div>
    ),
  },
  "password-input": {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <PasswordInput label={t("Password", "كلمة المرور")} helper={t("At least 8 characters, with a number.", "8 أحرف على الأقل، مع رقم.")} defaultValue="scopesky2026" />
      </div>
    ),
  },
  "text-area": {
    render: (_, { t }) => (
      <div className="w-full max-w-sm">
        <TextArea label={t("Message", "الرسالة")} placeholder={t("Describe the issue", "صِف المشكلة")} maxCount={300} helper={t("Include the time it started and any error message.", "اذكر وقت بدء المشكلة وأي رسالة خطأ.")} />
      </div>
    ),
  },
  "number-input": {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <NumberInput label={t("Number of devices", "عدد الأجهزة")} min={1} max={20} defaultValue={1} helper={t("From 1 to 20 devices per account.", "من 1 إلى 20 جهازاً لكل حساب.")} />
      </div>
    ),
  },
  search: {
    controls: [
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "expandable", type: "boolean", default: false },
    ],
    render: (v, { t }) => (
      <div className="w-full max-w-sm">
        <Search key={String(v.expandable)} placeholder={t("Search services", "ابحث في الخدمات")} size={v.size as "sm"} expandable={!!v.expandable} />
      </div>
    ),
  },
  "combo-box": {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <ComboBox label={t("City", "المدينة")} options={["Baghdad", "Basra", "Erbil", "Mosul", "Najaf", "Karbala", "Sulaymaniyah", "Kirkuk", "Duhok", "Hillah"]} />
      </div>
    ),
    minH: 340,
    layout: "start",
  },
  multiselect: {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <MultiSelect label={t("Notify me about", "أبلغني عن")} options={["Outages", "Invoices", "New offers", "Maintenance", "Security alerts"]} defaultValue={["Outages", "Invoices"]} />
      </div>
    ),
    minH: 320,
    layout: "start",
  },
  "date-picker": {
    render: (_, { t }) => <DatePicker label={t("Installation date", "تاريخ التركيب")} />,
    minH: 400,
    layout: "start",
  },
  "time-picker": {
    render: (_, { t }) => (
      <TimePicker
        label={t("Preferred visit time", "وقت الزيارة المفضل")}
        defaultValue="09:30"
        timeZones={[
          { value: "Asia/Baghdad", label: t("Baghdad (GMT+3)", "بغداد (GMT+3)") },
          { value: "UTC", label: "UTC" },
        ]}
      />
    ),
  },
  slider: {
    render: (_, { t }) => (
      <div className="w-full max-w-md">
        <Slider label={t("Monthly data cap (GB)", "حد البيانات الشهري (جيجابايت)")} min={0} max={500} defaultValue={200} />
      </div>
    ),
  },
  "file-uploader": {
    render: (_, { t }) => (
      <FileUploader
        title={t("Upload documents", "رفع المستندات")}
        note={t("Max file size is 5 MB. Supported file types are .pdf, .jpg and .png.", "الحد الأقصى لحجم الملف 5 ميجابايت. الأنواع المدعومة: ‎.pdf و‎.jpg و‎.png.")}
        accept=".pdf,.jpg,.jpeg,.png"
        maxSize={5_000_000}
        name="documents"
      />
    ),
  },
  "form-group": {
    render: (_, { t }) => (
      <div className="w-full max-w-sm">
        <FormGroup legend={t("Billing address", "عنوان الفوترة")}>
          <TextInput label={t("Street", "الشارع")} placeholder="14 Ramadan St." />
          <div className="grid grid-cols-2 gap-4">
            <TextInput label={t("City", "المدينة")} placeholder="Baghdad" />
            <TextInput label={t("Postcode", "الرمز البريدي")} placeholder="10011" />
          </div>
        </FormGroup>
      </div>
    ),
  },
  "fluid-form": {
    render: (_, { t }) => (
      <form className="grid w-full max-w-md grid-cols-2 gap-px bg-line" onSubmit={(e) => e.preventDefault()}>
        <FluidInput label={t("First name", "الاسم الأول")} placeholder="Sara" />
        <FluidInput label={t("Last name", "اسم العائلة")} placeholder="Hassan" />
        <div className="col-span-2">
          <FluidInput label={t("Phone number", "رقم الهاتف")} placeholder="0770 000 0000" invalid={t("Enter an 11-digit number starting with 07.", "أدخل رقماً من 11 خانة يبدأ بـ 07.")} />
        </div>
      </form>
    ),
  },
  "input-group": {
    render: (_, { t }) => (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <InputGroup prefix="https://" suffix=".scopesky.iq">
          <input aria-label={t("Subdomain", "النطاق الفرعي")} placeholder="clinic" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-placeholder focus:outline-none" dir="ltr" />
        </InputGroup>
        <InputGroup prefix={<Mail />}>
          <input aria-label={t("Email", "البريد")} placeholder="name@example.com" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-placeholder focus:outline-none" />
          <button type="button" className="border-s border-line-2 px-4 text-sm font-medium text-link hover:bg-layer-hover">
            {t("Subscribe", "اشترك")}
          </button>
        </InputGroup>
      </div>
    ),
  },
  "input-otp": { render: (_, { t }) => <InputOTP label={t("Verification code", "رمز التحقق")} /> },
  questionnaire: {
    render: (_, { t }) => (
      <State name="step" initial={0}>
        {(step, set) => {
          const qs = [
            { q: t("What do you mainly use the internet for?", "ما الاستخدام الرئيسي للإنترنت لديك؟"), o: [t("Work from home", "العمل من المنزل"), t("Streaming", "البث"), t("Gaming", "الألعاب")] },
            { q: t("How many people share the connection?", "كم شخصاً يشارك الاتصال؟"), o: ["1–2", "3–5", "6+"] },
            { q: t("Do you need a fixed IP address?", "هل تحتاج إلى عنوان IP ثابت؟"), o: [t("Yes", "نعم"), t("No", "لا"), t("Not sure", "لست متأكداً")] },
          ];
          if (step >= qs.length)
            return (
              <div className="w-full max-w-md rounded-box border border-line-2 p-6">
                <p className="text-base font-semibold text-ink">{t("We recommend Business fiber 100", "ننصحك بباقة الألياف للأعمال 100")}</p>
                <p className="mt-1 text-sm text-ink-2">{t("Based on your 3 answers.", "بناءً على إجاباتك الثلاث.")}</p>
                <Button size="md" kind="tertiary" onClick={() => set(0)} className="mt-4">
                  {t("Start again", "ابدأ من جديد")}
                </Button>
              </div>
            );
          return (
            <div className="w-full max-w-md rounded-box border border-line-2 p-6">
              <div className="flex items-center justify-between text-xs text-ink-2">
                <span>
                  {t("Question", "السؤال")} {step + 1} / {qs.length}
                </span>
                <span>{Math.round((step / qs.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-line">
                <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(step / qs.length) * 100}%` }} />
              </div>
              <p className="mt-5 text-base font-semibold text-ink">{qs[step].q}</p>
              <div className="mt-3 flex flex-col gap-2">
                {qs[step].o.map((o) => (
                  <button key={o} type="button" onClick={() => set(step + 1)} className="h-11 rounded-md border border-line-2 px-4 text-start text-sm text-ink hover:border-focus hover:bg-tint">
                    {o}
                  </button>
                ))}
              </div>
              <Button size="md" kind="ghost" disabled={step === 0} onClick={() => set(step - 1)} className="mt-3">
                {t("Back", "رجوع")}
              </Button>
            </div>
          );
        }}
      </State>
    ),
  },

  /* Selection */
  dropdown: {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <Dropdown label={t("Plan", "الباقة")} options={["Home 50 Mbps", "Home 100 Mbps", "Business fiber 100", "Business fiber 500"]} defaultValue="Home 100 Mbps" />
      </div>
    ),
    minH: 320,
    layout: "start",
  },
  select: {
    render: (_, { t }) => (
      <div className="w-full max-w-xs">
        <Select label={t("Governorate", "المحافظة")} options={["Baghdad", "Basra", "Erbil", "Najaf"]} helper={t("Where the service will be installed.", "مكان تركيب الخدمة.")} />
      </div>
    ),
  },
  checkbox: {
    render: (_, { t }) => (
      <State name="checked" initial={{ a: true, b: false, c: true }}>
        {(v, s) => {
          const all = v.a && v.b && v.c;
          const some = v.a || v.b || v.c;
          return (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-xs text-ink-2">{t("Notifications", "الإشعارات")}</legend>
              <Checkbox label={t("All channels", "كل القنوات")} checked={all} indeterminate={!all && some} onCheckedChange={(c) => s({ a: c, b: c, c: c })} />
              <div className="flex flex-col gap-3 ps-6">
                <Checkbox label={t("Email", "البريد الإلكتروني")} checked={v.a} onCheckedChange={(a) => s({ ...v, a })} />
                <Checkbox label="SMS" checked={v.b} onCheckedChange={(b) => s({ ...v, b })} />
                <Checkbox label={t("Push notifications", "الإشعارات الفورية")} checked={v.c} onCheckedChange={(c) => s({ ...v, c })} />
              </div>
              <Checkbox label={t("Paper invoices (not available)", "فواتير ورقية (غير متاحة)")} checked={false} disabled />
            </fieldset>
          );
        }}
      </State>
    ),
  },
  "radio-button": {
    controls: [{ name: "orientation", type: "select", options: ["vertical", "horizontal"], default: "vertical" }],
    render: (v, { t }) => (
      <State name="billing" initial="Monthly">
        {(val, s) => (
          <RadioGroup
            legend={t("Billing cycle", "دورة الفوترة")}
            orientation={v.orientation as "vertical"}
            options={[
              { value: "Monthly", label: t("Monthly", "شهرياً") },
              { value: "Quarterly", label: t("Quarterly", "كل ثلاثة أشهر") },
              { value: "Yearly", label: t("Yearly", "سنوياً") },
            ]}
            value={val}
            onValueChange={s}
          />
        )}
      </State>
    ),
  },
  toggle: {
    controls: [
      { name: "size", type: "select", options: ["md", "sm"], default: "md" },
      { name: "disabled", type: "boolean", default: false },
    ],
    render: (v, { t }) => (
      <State name="autoPay" initial={true}>
        {(c, s) => <Toggle label={t("Auto-pay invoices", "الدفع التلقائي للفواتير")} checked={c} onCheckedChange={s} size={v.size as "md"} disabled={!!v.disabled} onText={t("On", "مفعّل")} offText={t("Off", "متوقف")} />}
      </State>
    ),
  },
  "content-switcher": {
    render: (_, { t }) => (
      <State name="view" initial={t("Usage", "الاستهلاك")}>
        {(v, s) => (
          <div className="flex w-full max-w-md flex-col gap-4">
            <ContentSwitcher label={t("View", "العرض")} options={[t("Usage", "الاستهلاك"), t("Invoices", "الفواتير"), t("Devices", "الأجهزة")]} value={v} onValueChange={s} />
            <p className="text-sm text-ink-2">{t("Showing", "عرض")}: {v}</p>
          </div>
        )}
      </State>
    ),
  },

  /* Feedback */
  notification: {
    controls: [
      { name: "kind", type: "select", options: ["info", "success", "warning", "error"], default: "error" },
      { name: "variant", type: "select", options: ["inline", "toast"], default: "inline" },
      { name: "lowContrast", type: "boolean", default: true },
      { name: "withAction", type: "boolean", default: false, label: "Actionable" },
    ],
    render: (v, { t }) => {
      const copy: Record<string, [string, string]> = {
        error: [t("Payment failed", "فشل الدفع"), t("Your card was declined. Use another card or pay at a branch.", "تم رفض بطاقتك. استخدم بطاقة أخرى أو ادفع في أحد الفروع.")],
        success: [t("Request sent", "تم إرسال الطلب"), t("We will call you within one working day.", "سنتصل بك خلال يوم عمل واحد.")],
        warning: [t("Scheduled maintenance", "صيانة مجدولة"), t("Service may drop between 02:00 and 04:00 on Friday.", "قد تنقطع الخدمة بين 02:00 و04:00 يوم الجمعة.")],
        info: [t("New plan available", "باقة جديدة متاحة"), t("Business fiber 1 Gbps is now available in your area.", "باقة الألياف 1 جيجابت متاحة الآن في منطقتك.")],
      };
      const [title, sub] = copy[v.kind as string];
      return (
        <div className="w-full max-w-xl">
          <Notification kind={v.kind as Kind} variant={v.variant as "inline"} lowContrast={!!v.lowContrast} title={title} subtitle={sub} actionText={v.withAction ? t("Try again", "حاول مجدداً") : undefined} onAction={v.withAction ? () => {} : undefined} timestamp={v.variant === "toast" ? "09:30" : undefined} onClose={() => {}} />
        </div>
      );
    },
  },
  modal: {
    controls: [
      { name: "danger", type: "boolean", default: false },
      { name: "size", type: "select", options: ["xs", "sm", "md"], default: "sm" },
    ],
    render: (v, { t }) => (
      <State name="open" initial={false}>
        {(open, set) => (
          <>
            <Button kind={v.danger ? "danger" : "primary"} onClick={() => set(true)}>
              {v.danger ? t("Cancel subscription", "إلغاء الاشتراك") : t("Change plan", "تغيير الباقة")}
            </Button>
            <Modal
              open={open}
              onOpenChange={set}
              onPrimaryClick={() => set(false)}
              danger={!!v.danger}
              size={v.size as "sm"}
              label={t("Account", "الحساب")}
              heading={v.danger ? t("Cancel your subscription?", "إلغاء اشتراكك؟") : t("Change your plan", "تغيير باقتك")}
              primaryText={v.danger ? t("Cancel subscription", "إلغاء الاشتراك") : t("Change plan", "تغيير الباقة")}
              secondaryText={v.danger ? t("Keep subscription", "الإبقاء على الاشتراك") : t("Cancel", "إلغاء")}
            >
              {v.danger
                ? t("Service stops at the end of this billing cycle, on 30 November. You can rejoin any time.", "تتوقف الخدمة في نهاية دورة الفوترة الحالية في 30 نوفمبر. يمكنك العودة في أي وقت.")
                : t("Your new plan starts on the first day of next month. We will email you the new price.", "تبدأ باقتك الجديدة في اليوم الأول من الشهر القادم. سنرسل لك السعر الجديد بالبريد.")}
            </Modal>
          </>
        )}
      </State>
    ),
  },
  "progress-bar": {
    controls: [
      { name: "value", type: "select", options: ["0", "25", "60", "100", "indeterminate"], default: "60" },
      { name: "status", type: "select", options: ["active", "finished", "error"], default: "active" },
      { name: "size", type: "select", options: ["big", "small"], default: "big" },
    ],
    render: (v, { t }) => (
      <div className="w-full max-w-md">
        <ProgressBar
          label={t("Uploading contract.pdf", "جارٍ رفع contract.pdf")}
          value={v.value === "indeterminate" ? undefined : +(v.value as string)}
          status={v.status as "active"}
          size={v.size as "big"}
          helper={v.status === "error" ? t("Upload failed. Check your connection and try again.", "فشل الرفع. تحقق من اتصالك وحاول مجدداً.") : v.status === "finished" ? t("Uploaded", "تم الرفع") : `${v.value === "indeterminate" ? "" : v.value + "% · "}${t("2.1 MB of 3.5 MB", "2.1 من 3.5 ميجابايت")}`}
        />
      </div>
    ),
  },
  "progress-indicator": {
    controls: [{ name: "vertical", type: "boolean", default: false }],
    render: (v, { t }) => (
      <div className="w-full max-w-2xl">
        <ProgressIndicator
          vertical={!!v.vertical}
          current={2}
          steps={[
            { label: t("Choose plan", "اختيار الباقة") },
            { label: t("Your details", "بياناتك") },
            { label: t("Installation", "التركيب"), note: t("Pick a date", "اختر موعداً") },
            { label: t("Payment", "الدفع") },
            { label: t("Review", "المراجعة") },
          ]}
        />
      </div>
    ),
  },
  loading: {
    render: (_, { t }) => (
      <div className="flex flex-wrap items-center gap-10">
        <Loading />
        <Loading size="small" />
        <State name="progress" initial={0}>
          {(s, set) => (
            <div className="flex flex-col items-start gap-3">
              <InlineLoading state={s === 0 ? "active" : s === 1 ? "finished" : "error"} text={s === 0 ? t("Saving…", "جارٍ الحفظ…") : s === 1 ? t("Saved", "تم الحفظ") : t("Could not save", "تعذّر الحفظ")} />
              <button type="button" onClick={() => set((s + 1) % 3)} className="text-xs text-link underline">
                {t("Next state", "الحالة التالية")}
              </button>
            </div>
          )}
        </State>
      </div>
    ),
  },
  skeleton: {
    render: () => (
      <div className="flex w-full max-w-sm items-center gap-4" aria-busy="true" aria-label="Loading account">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ),
  },
  tooltip: {
    render: (_, { t }) => (
      <Tooltip label={t("Download invoice as PDF", "تنزيل الفاتورة بصيغة PDF")}>
        <Button kind="ghost" iconOnly icon={<Download />} size="md">
          {t("Download", "تنزيل")}
        </Button>
      </Tooltip>
    ),
    minH: 200,
  },
  toggletip: {
    render: (_, { t }) => (
      <div className="flex items-center gap-1 text-sm text-ink">
        {t("Data cap", "حد البيانات")}
        <Toggletip label={t("About data caps", "حول حد البيانات")}>
          <p className="text-sm">{t("Usage resets on the 1st of each month. Unused data does not carry over.", "يُعاد ضبط الاستهلاك في أول كل شهر. البيانات غير المستخدمة لا تُرحَّل.")}</p>
          <a href="#" onClick={(e) => e.preventDefault()} className="mt-2 inline-block text-sm text-[#65c0e9] underline">
            {t("See plan details", "تفاصيل الباقة")}
          </a>
        </Toggletip>
      </div>
    ),
    minH: 260,
    layout: "start",
  },
  "definition-tooltip": {
    render: (_, { t }) => (
      <p className="max-w-md text-sm text-ink">
        {t("Your plan includes a ", "تتضمن باقتك ")}
        <DefinitionTooltip term={t("static IP", "عنوان IP ثابت")} definition={t("An address that never changes, so you can host a server or connect a VPN.", "عنوان لا يتغير، لتتمكن من استضافة خادم أو الاتصال بشبكة VPN.")} />
        {t(" and 24/7 support.", " ودعماً على مدار الساعة.")}
      </p>
    ),
    minH: 200,
  },
  popover: {
    render: (_, { t }) => (
      <Popover
        label={t("Display settings", "إعدادات العرض")}
        trigger={(p) => (
          <Button size="md" kind="tertiary" {...p} icon={<Settings />}>{t("Display", "العرض")}
          </Button>
        )}
      >
        <p className="text-sm font-semibold">{t("Display", "العرض")}</p>
        <p className="mt-1 text-sm text-ink-2">{t("Choose what shows in the table.", "اختر ما يظهر في الجدول.")}</p>
        <div className="mt-3 flex flex-col gap-2">
          <Checkbox label={t("Show archived", "إظهار المؤرشف")} />
          <Checkbox label={t("Compact rows", "صفوف مضغوطة")} defaultChecked />
        </div>
      </Popover>
    ),
    minH: 280,
    layout: "start",
  },
  "ai-label": {
    controls: [{ name: "size", type: "select", options: ["xs", "sm", "md"], default: "sm" }],
    render: (v, { t }) => (
      <div className="flex w-full max-w-md items-start justify-between gap-4 bg-layer p-4">
        <div>
          <p className="text-sm font-semibold text-ink">{t("Ticket summary", "ملخص التذكرة")}</p>
          <p className="mt-1 text-sm text-ink-2">{t("Customer reports slow speeds after 8 pm. Likely congestion on node BGD-14.", "يبلغ العميل عن بطء بعد الساعة 8 مساءً. يُرجّح ازدحام على العقدة BGD-14.")}</p>
        </div>
        <AILabel size={v.size as "sm"}>
          <p className="text-2xl">84%</p>
          <p className="text-sm font-semibold">{t("Confidence score", "درجة الثقة")}</p>
          <p className="text-sm text-ink-2">{t("This summary was generated from the last 30 days of support tickets. Check the source records before acting on it.", "أُنشئ هذا الملخص من تذاكر الدعم في آخر 30 يوماً. راجع السجلات الأصلية قبل التصرف بناءً عليه.")}</p>
        </AILabel>
      </div>
    ),
    minH: 340,
    layout: "start",
  },
  empty: {
    render: (_, { t }) => (
      <Empty
        icon={<Inbox />}
        title={t("No requests yet", "لا توجد طلبات بعد")}
        body={t("When you open a service request, it shows up here with its status.", "عندما تفتح طلب خدمة، يظهر هنا مع حالته.")}
        action={
          <Button size="md" icon={<Plus />}>{t("New request", "طلب جديد")}
          </Button>
        }
      />
    ),
  },

  /* Navigation */
  "ui-shell": {
    render: (_, { t }) => (
      <UIShell
        className="h-72"
        portal={t("Customer portal", "بوابة العملاء")}
        homeHref="#"
        headerLinks={[
          { label: t("Plans", "الباقات"), href: "#" },
          { label: t("Coverage", "التغطية"), href: "#" },
          { label: t("Help", "المساعدة"), href: "#" },
        ]}
        actions={
          <>
            <UIShellAction label={t("Search", "بحث")} icon={<SearchIcon />} />
            <UIShellAction label={t("Notifications", "الإشعارات")} icon={<Bell />} />
            <UIShellAction label={t("App switcher", "تبديل التطبيقات")} icon={<Grid3x3 />} />
          </>
        }
        navItems={[
          { id: "dashboard", label: t("Dashboard", "لوحة التحكم") },
          { id: "services", label: t("Services", "الخدمات") },
          { id: "requests", label: t("Requests", "الطلبات") },
          { id: "invoices", label: t("Invoices", "الفواتير") },
        ]}
      >
        <h3 className="text-2xl text-ink">{t("Dashboard", "لوحة التحكم")}</h3>
        <p className="mt-1 text-sm text-ink-2">{t("Your page content goes here.", "يظهر محتوى صفحتك هنا.")}</p>
      </UIShell>
    ),
    layout: "stretch",
  },
  tabs: {
    controls: [{ name: "variant", type: "select", options: ["line", "contained"], default: "line" }],
    render: (v, { t }) => (
      <div className="w-full max-w-xl">
        <Tabs
          key={v.variant as string}
          variant={v.variant as "line"}
          label={t("Account sections", "أقسام الحساب")}
          tabs={[
            { label: t("Overview", "نظرة عامة"), content: t("Your plan, usage this month and next invoice date.", "باقتك واستهلاك هذا الشهر وموعد الفاتورة القادمة.") },
            { label: t("Requests", "الطلبات"), content: t("Open and closed service requests.", "طلبات الخدمة المفتوحة والمغلقة.") },
            { label: t("Settings", "الإعدادات"), content: t("Contact details, notifications and security.", "بيانات التواصل والإشعارات والأمان.") },
            { label: t("Billing", "الفوترة"), content: "", disabled: true },
          ]}
        />
      </div>
    ),
  },
  breadcrumb: {
    render: (_, { t }) => <Breadcrumb items={[{ label: t("Home", "الرئيسية"), href: "#" }, { label: t("Services", "الخدمات"), href: "#" }, { label: t("Business fiber", "الألياف للأعمال"), href: "#" }, "SR-20481"]} />,
  },
  pagination: { render: () => <div className="w-full max-w-2xl"><Pagination total={237} /></div> },
  "pagination-nav": { render: () => <PaginationNav pages={12} defaultPage={4} /> },
  command: {
    render: (_, { t }) => (
      <Command
        groups={[
          { heading: t("Suggestions", "اقتراحات"), items: [{ label: t("Calendar", "التقويم"), icon: <Calendar /> }, { label: t("Search emoji", "البحث عن رموز"), icon: <Smile /> }] },
          {
            heading: t("Settings", "الإعدادات"),
            items: [
              { label: t("Profile", "الملف الشخصي"), icon: <User />, shortcut: "Ctrl P" },
              { label: t("Billing", "الفوترة"), icon: <CreditCard />, shortcut: "Ctrl B" },
              { label: t("Settings", "الإعدادات"), icon: <Settings />, shortcut: "Ctrl S" },
            ],
          },
        ]}
        placeholder={t("Type a command or search…", "اكتب أمراً أو ابحث…")}
      />
    ),
  },
  "context-menu": {
    render: (_, { t }) => (
      <ContextMenuArea className="flex h-44 w-full max-w-md select-none flex-col items-center justify-center gap-1 rounded-box border border-dashed border-line-strong text-sm text-ink-2" items={[{ label: t("Back", "رجوع"), shortcut: "Alt ←" }, { label: t("Reload", "إعادة تحميل"), shortcut: "Ctrl R" }, { label: "d", divider: true }, { label: t("Save as…", "حفظ باسم…"), shortcut: "Ctrl S" }, { label: t("Print…", "طباعة…"), shortcut: "Ctrl P" }]}>
        <span>{t("Right-click here", "انقر بزر الفأرة الأيمن هنا")}</span>
        <span className="text-xs">{t("or focus and press Shift + F10", "أو ركّز واضغط Shift + F10")}</span>
      </ContextMenuArea>
    ),
    minH: 320,
  },
  menubar: {
    render: (_, { t }) => (
      <Menubar
        menus={[
          { label: t("File", "ملف"), items: [{ label: t("New request", "طلب جديد"), shortcut: "Ctrl N" }, { label: t("Open…", "فتح…"), shortcut: "Ctrl O" }, { label: "d", divider: true }, { label: t("Print", "طباعة"), shortcut: "Ctrl P" }] },
          { label: t("Edit", "تحرير"), items: [{ label: t("Undo", "تراجع"), shortcut: "Ctrl Z" }, { label: t("Redo", "إعادة"), shortcut: "Ctrl Y" }] },
          { label: t("View", "عرض"), items: [{ label: t("Compact rows", "صفوف مضغوطة") }, { label: t("Full screen", "ملء الشاشة"), shortcut: "F11" }] },
        ]}
      />
    ),
    minH: 280,
    layout: "start",
  },
  "navigation-menu": {
    render: (_, { t }) => (
      <NavigationMenu
        items={[
          {
            label: t("Home internet", "الإنترنت المنزلي"),
            links: [
              { title: t("Fiber plans", "باقات الألياف"), body: t("Up to 1 Gbps with free installation.", "حتى 1 جيجابت مع تركيب مجاني."), href: "#" },
              { title: t("Wireless plans", "الباقات اللاسلكية"), body: t("For areas without fiber yet.", "للمناطق التي لا تصلها الألياف بعد."), href: "#" },
              { title: t("Coverage map", "خريطة التغطية"), body: t("Check what is available at your address.", "تحقق مما هو متاح في عنوانك."), href: "#" },
              { title: t("Add-ons", "الإضافات"), body: t("Static IP, mesh Wi-Fi and more.", "IP ثابت وشبكة Wi-Fi ممتدة والمزيد."), href: "#" },
            ],
          },
          { label: t("Business", "الأعمال"), links: [{ title: t("Dedicated lines", "خطوط مخصصة"), body: t("Guaranteed bandwidth with an SLA.", "سعة مضمونة مع اتفاقية مستوى خدمة."), href: "#" }, { title: t("Cloud backup", "النسخ الاحتياطي السحابي"), body: t("Daily backups kept in Iraq.", "نسخ يومية محفوظة داخل العراق."), href: "#" }] },
          { label: t("Support", "الدعم"), href: "#" },
        ]}
      />
    ),
    minH: 320,
    layout: "start",
  },

  /* Data display */
  "data-table": {
    controls: [
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "lg" },
      { name: "tone", type: "select", options: ["grey", "sky"], default: "grey" },
      { name: "useZebraStyles", type: "boolean", default: false },
      { name: "radio", type: "boolean", default: true, label: "Selectable rows" },
    ],
    render: (v, { t }) => (
      <DataTable
        columns={requestColumns(t)}
        data={requests}
        size={v.size as "lg"}
        tone={v.tone as "grey"}
        zebra={!!v.useZebraStyles}
        selectable={!!v.radio}
        title={t("Service requests", "طلبات الخدمة")}
        description={t("Requests opened in the last 30 days.", "الطلبات المفتوحة خلال آخر 30 يوماً.")}
        filterPlaceholder={t("Filter requests", "تصفية الطلبات")}
        batchActions={() => <button type="button">{t("Export", "تصدير")}</button>}
      />
    ),
    layout: "stretch",
  },
  "structured-list": {
    controls: [{ name: "selection", type: "boolean", default: false }],
    render: (v, { t }) => (
      <div className="w-full max-w-lg">
        <StructuredList
          selectable={!!v.selection}
          label={t("Plans", "الباقات")}
          getRowId={(r) => r.plan}
          defaultValue="Home 50"
          columns={[
            { key: "plan", header: t("Plan", "الباقة") },
            { key: "speed", header: t("Speed", "السرعة") },
            { key: "price", header: t("Price", "السعر") },
          ]}
          rows={[
            { plan: "Home 50", speed: "50 Mbps", price: "25,000 IQD" },
            { plan: "Home 100", speed: "100 Mbps", price: "35,000 IQD" },
            { plan: "Business 500", speed: "500 Mbps", price: "120,000 IQD" },
          ]}
        />
      </div>
    ),
  },
  "contained-list": {
    render: (_, { t }) => (
      <State name="contacts" initial={["Sara Hassan", "Omar Kareem", "Layla Abbas", "Yusuf Nouri"]}>
        {(list, set) => (
      <ContainedList
        label={t("Account contacts", "جهات اتصال الحساب")}
        items={list}
        onRemove={(id) => set(list.filter((x) => x !== id))}
        emptyText={t("No contacts left. Add one to get updates.", "لم تبقَ جهات اتصال. أضف واحدة لتصلك التحديثات.")}
        action={
          <button type="button" aria-label={t("Add contact", "إضافة جهة اتصال")} className="inline-flex size-8 items-center justify-center text-ink hover:bg-layer-hover">
            <Plus className="size-4" />
          </button>
        }
      />
        )}
      </State>
    ),
  },
  list: {
    controls: [{ name: "ordered", type: "boolean", default: false }],
    render: (v, { t }) => (
      <List
        ordered={!!v.ordered}
        items={[t("Unplug the router", "افصل الراوتر"), t("Wait 30 seconds", "انتظر 30 ثانية"), { text: t("Plug it back in", "أعد توصيله"), children: [t("Power cable first", "كابل الطاقة أولاً"), t("Then the fiber cable", "ثم كابل الألياف")] }, t("Wait for the green light", "انتظر الضوء الأخضر")]}
      />
    ),
  },
  "tree-view": {
    render: (_, { t }) => (
      <TreeView
        label={t("Documents", "المستندات")}
        defaultExpanded={["Contracts"]}
        defaultSelected="Contracts/2026"
        nodes={[
          { label: "Contracts", children: [{ label: "2026", children: [{ label: "al-noor-clinic.pdf" }, { label: "rafidain.pdf" }] }, { label: "2025" }] },
          { label: "Invoices", children: [{ label: "november.pdf" }, { label: "october.pdf" }] },
          { label: "readme.txt" },
        ]}
      />
    ),
    layout: "start",
  },
  tile: {
    controls: [{ name: "variant", type: "select", options: ["base", "clickable", "selectable", "expandable"], default: "clickable" }],
    render: (v, { t }) => (
      <State name="selected" initial={0}>
        {(sel, set) => (
          <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
            {[
              [t("Business fiber", "الألياف للأعمال"), t("Dedicated line, 99.9% uptime and 24/7 support.", "خط مخصص وتوفر 99.9% ودعم على مدار الساعة.")],
              [t("Home fiber", "الألياف المنزلية"), t("Up to 1 Gbps with free installation.", "حتى 1 جيجابت مع تركيب مجاني.")],
            ].map(([title, body], i) => (
              <Tile key={title} title={title} body={body} variant={v.variant as "base"} href={v.variant === "clickable" ? "#" : undefined} selected={sel === i} onSelectedChange={() => set(i)}>
                {t("Includes a static IP, priority repair within 4 hours and a monthly usage report.", "يشمل عنوان IP ثابتاً وإصلاحاً ذا أولوية خلال 4 ساعات وتقرير استهلاك شهرياً.")}
              </Tile>
            ))}
          </div>
        )}
      </State>
    ),
  },
  accordion: {
    controls: [
      { name: "align", type: "select", options: ["end", "start"], default: "end" },
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "flush", type: "boolean", default: false },
    ],
    render: (v, { t }) => (
      <div className="w-full max-w-xl">
        <Accordion items={faq(t)} defaultValue={["0"]} align={v.align as "end"} size={v.size as "md"} flush={!!v.flush} />
      </div>
    ),
  },
  tag: {
    controls: [
      { name: "type", type: "select", options: ["gray", "blue", "green", "red", "warm", "cyan", "outline"], default: "green" },
      { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { name: "filter", type: "boolean", default: false, label: "Dismissible" },
    ],
    render: (v, { t }) => (
      <State name="filters" initial={["Fiber", "Wireless", "Business"]}>
        {(sel, set) => (
          <div className="flex flex-col items-center gap-6">
            <Tag type={v.type as TagType} size={v.size as "md"} onDismiss={v.filter ? () => {} : undefined}>
              {t("Active", "نشط")}
            </Tag>
            <div className="flex flex-wrap justify-center gap-2" aria-label={t("Filter by service", "تصفية حسب الخدمة")}>
              {["Fiber", "Wireless", "Business", "Home", "Cloud"].map((x) => (
                <Tag key={x} selected={sel.includes(x)} onSelectedChange={() => set(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x])}>
                  {x}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </State>
    ),
  },
  "code-snippet": {
    controls: [{ name: "type", type: "select", options: ["single", "multi", "inline"], default: "multi" }],
    render: (v) => (
      <CodeSnippet
        type={v.type as "multi"}
        code={v.type === "multi" ? `{\n  "plan": "business-fiber-500",\n  "status": "active",\n  "staticIp": "185.12.40.17",\n  "sla": "99.9%",\n  "support": "24/7",\n  "renewsOn": "2026-12-01"\n}` : v.type === "single" ? "npm i @scopesky/ui" : "--ss-blue-700"}
      />
    ),
  },
  attachment: {
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Attachment name="contract-signed.pdf" meta="PDF · 812 KB" onRemove={() => {}} />
        <Attachment name="site-photo.jpg" meta="JPG · 2.4 MB" kind="image" progress={64} />
      </div>
    ),
  },
  avatar: {
    controls: [{ name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" }],
    render: (v) => (
      <div className="flex items-center gap-6">
        <Avatar name="Sara Hassan" size={v.size as "md"} status="online" />
        <Avatar name="Omar Kareem" size={v.size as "md"} status="away" />
        <Avatar name="Layla Abbas" size={v.size as "md"} />
        <AvatarGroup names={["Sara Hassan", "Omar Kareem", "Layla Abbas", "Yusuf Nouri", "Huda Saleh"]} />
      </div>
    ),
  },
  carousel: {
    render: (_, { t }) => (
      <Carousel
        slides={[
          { title: t("Home fiber 100", "الألياف المنزلية 100"), body: t("Streaming in every room.", "بث في كل غرفة.") },
          { title: t("Business 500", "الأعمال 500"), body: t("Static IP and a 4-hour repair promise.", "IP ثابت والتزام بالإصلاح خلال 4 ساعات.") },
          { title: t("Cloud backup", "النسخ السحابي"), body: t("Daily backups, kept in Iraq.", "نسخ يومية محفوظة داخل العراق.") },
        ]}
      />
    ),
  },
  chart: {
    render: (_, { t }) => (
      <BarChart
        label={t("New subscriptions", "اشتراكات جديدة")}
        description={t("Jun – Nov 2026", "يونيو – نوفمبر 2026")}
        categoryKey="month"
        series={[
          { key: "business", label: t("Business", "الأعمال") },
          { key: "home", label: t("Home", "المنازل") },
        ]}
        data={[
          { month: "Jun", business: 120, home: 210 },
          { month: "Jul", business: 140, home: 260 },
          { month: "Aug", business: 165, home: 240 },
          { month: "Sep", business: 190, home: 300 },
          { month: "Oct", business: 210, home: 330 },
          { month: "Nov", business: 260, home: 310 },
        ]}
      />
    ),
  },
  item: {
    controls: [{ name: "variant", type: "select", options: ["default", "outline", "muted"], default: "outline" }],
    render: (v, { t }) => (
      <div className="flex w-full max-w-md flex-col gap-3">
        <Item
          variant={v.variant as "outline"}
          media={<Avatar name="Sara Hassan" />}
          title="Sara Hassan"
          description={t("Account manager · replies in about 1 hour", "مديرة الحساب · ترد خلال ساعة تقريباً")}
          actions={
            <Button size="md" kind="tertiary">
              {t("Message", "مراسلة")}
            </Button>
          }
        />
        <Item
          variant={v.variant as "outline"}
          media={
            <span className="inline-flex size-9 items-center justify-center rounded-md bg-tint text-primary">
              <Wifi className="size-4" />
            </span>
          }
          title={t("Business fiber 500", "الألياف للأعمال 500")}
          description={t("Renews on 1 December", "يتجدد في 1 ديسمبر")}
          actions={<Tag type="green">{t("Active", "نشط")}</Tag>}
        />
      </div>
    ),
  },
  kbd: {
    render: (_, { t }) => (
      <div className="flex flex-col items-center gap-4 text-sm text-ink-2">
        <span className="flex items-center gap-1">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
        <span>
          {t("Press", "اضغط")} <Kbd>Esc</Kbd> {t("to close the dialog.", "لإغلاق النافذة.")}
        </span>
      </div>
    ),
  },

  /* Overlays */
  "alert-dialog": {
    render: (_, { t }) => (
      <State name="open" initial={false}>
        {(open, set) => (
          <>
            <Button size="md" kind="danger" onClick={() => set(true)} icon={<Trash2 />}>{t("Delete request", "حذف الطلب")}
            </Button>
            <AlertDialog
              open={open}
              onOpenChange={set}
              title={t("Delete this request?", "حذف هذا الطلب؟")}
              description={t("This permanently removes REQ-2051 and its history. You can't undo this.", "سيؤدي هذا إلى حذف الطلب REQ-2051 وسجله نهائياً. لا يمكنك التراجع عن ذلك.")}
              cancelText={t("Cancel", "إلغاء")}
              actionText={t("Delete", "حذف")}
              onAction={() => {}}
            />
          </>
        )}
      </State>
    ),
  },
  drawer: {
    render: (_, { t }) => (
      <State name="open" initial={false}>
        {(open, set) => (
          <>
            <Button size="md" kind="tertiary" onClick={() => set(true)}>
              {t("Set data alert", "ضبط تنبيه البيانات")}
            </Button>
            <Drawer
              open={open}
              onOpenChange={set}
              title={t("Data alert", "تنبيه البيانات")}
              description={t("We text you when you reach this share of your cap.", "نرسل لك رسالة عند بلوغ هذه النسبة من حدك.")}
              footer={
                <>
                  <Button size="md" onClick={() => set(false)}>
                    {t("Save alert", "حفظ التنبيه")}
                  </Button>
                  <Button size="md" kind="tertiary" onClick={() => set(false)}>
                    {t("Cancel", "إلغاء")}
                  </Button>
                </>
              }
            >
              <Slider label={t("Alert at (%)", "التنبيه عند (%)")} min={50} max={100} defaultValue={80} />
            </Drawer>
          </>
        )}
      </State>
    ),
  },
  "hover-card": {
    render: (_, { t }) => (
      <p className="text-sm text-ink">
        {t("Assigned to ", "مُسند إلى ")}
        <HoverCard
          trigger={
            <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-link underline-offset-4 hover:underline">
              @sara.hassan
            </a>
          }
        >
          <div className="flex gap-3">
            <Avatar name="Sara Hassan" size="lg" />
            <div>
              <p className="text-sm font-semibold text-ink">Sara Hassan</p>
              <p className="text-sm text-ink-2">{t("Account manager, Baghdad branch", "مديرة حساب، فرع بغداد")}</p>
              <p className="mt-2 text-xs text-ink-3">{t("Joined March 2024", "انضمت في مارس 2024")}</p>
            </div>
          </div>
        </HoverCard>
      </p>
    ),
    minH: 260,
    layout: "start",
  },
  sheet: {
    controls: [{ name: "side", type: "select", options: ["right", "left"], default: "right" }],
    render: (v, { t }) => (
      <State name="open" initial={false}>
        {(open, set) => (
          <>
            <Button size="md" kind="tertiary" onClick={() => set(true)}>
              {t("Edit customer", "تعديل العميل")}
            </Button>
            <Sheet
              open={open}
              onOpenChange={set}
              side={v.side as "right"}
              title={t("Edit customer", "تعديل العميل")}
              description={t("Changes save to the account.", "تُحفظ التغييرات في الحساب.")}
              footer={
                <>
                  <Button size="md" kind="tertiary" onClick={() => set(false)}>
                    {t("Cancel", "إلغاء")}
                  </Button>
                  <Button size="md" onClick={() => set(false)}>
                    {t("Save changes", "حفظ التغييرات")}
                  </Button>
                </>
              }
            >
              <div className="flex flex-col gap-4 pb-6">
                <TextInput label={t("Name", "الاسم")} defaultValue="Al-Noor Clinic" />
                <TextInput label={t("Phone", "الهاتف")} defaultValue="0770 123 4567" />
              </div>
            </Sheet>
          </>
        )}
      </State>
    ),
  },

  /* Layout */
  "aspect-ratio": {
    controls: [{ name: "ratio", type: "select", options: ["16/9", "4/3", "1/1"], default: "16/9" }],
    render: (v) => {
      const [a, b] = (v.ratio as string).split("/").map(Number);
      return (
        <div className="w-full max-w-md">
          <AspectRatio ratio={a / b}>
            <div className="flex size-full items-center justify-center bg-[linear-gradient(135deg,#eaf7fd_0%,#9dd8f3_45%,#0183be_100%)] font-mono text-sm text-[#003044]">{v.ratio as string}</div>
          </AspectRatio>
        </div>
      );
    },
  },
  collapsible: {
    render: (_, { t }) => (
      <Collapsible
        title={t("3 devices connected", "3 أجهزة متصلة")}
        showText={t("Show 2 more", "عرض 2 إضافيين")}
        preview={<div className="rounded-lg border border-line-2 px-4 py-2 font-mono text-sm text-ink">Living-room TV · 192.168.1.12</div>}
      >
        <div className="rounded-lg border border-line-2 px-4 py-2 font-mono text-sm text-ink">Sara&apos;s laptop · 192.168.1.20</div>
        <div className="rounded-lg border border-line-2 px-4 py-2 font-mono text-sm text-ink">Kitchen speaker · 192.168.1.31</div>
      </Collapsible>
    ),
  },
  resizable: { render: (_, { t }) => <Resizable start={t("Requests", "الطلبات")} end={t("Details", "التفاصيل")} /> },
  "scroll-area": {
    render: (_, { t }) => (
      <ScrollArea className="h-60 w-56">
        <div className="p-4">
          <p className="mb-3 text-sm font-semibold text-ink">{t("Release tags", "وسوم الإصدارات")}</p>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i}>
              <p className="py-2 font-mono text-[13px] text-ink">v1.{30 - i}.0</p>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
  },
  separator: {
    render: (_, { t }) => (
      <div className="w-full max-w-sm">
        <p className="text-sm font-semibold text-ink">ScopeSky UI</p>
        <p className="text-sm text-ink-2">{t("Components for every ScopeSky website.", "مكونات لكل مواقع سكوب سكاي.")}</p>
        <div className="my-4">
          <Separator />
        </div>
        <div className="flex h-5 items-center gap-4 text-sm text-ink">
          <span>{t("Docs", "التوثيق")}</span>
          <Separator orientation="vertical" />
          <span>{t("Source", "المصدر")}</span>
          <Separator orientation="vertical" />
          <span>{t("Changelog", "سجل التغييرات")}</span>
        </div>
      </div>
    ),
  },

  /* Conversation */
  bubble: {
    render: (_, { t }) => (
      <div className="flex w-full max-w-md flex-col gap-2">
        <Bubble>{t("Hi Sara, my connection drops every evening.", "مرحباً سارة، ينقطع الاتصال لدي كل مساء.")}</Bubble>
        <Bubble from="me">{t("Thanks. I'm checking node BGD-14 now.", "شكراً. أتحقق من العقدة BGD-14 الآن.")}</Bubble>
        <Bubble tone="error">{t("Message not sent. Tap to try again.", "لم تُرسل الرسالة. اضغط للمحاولة مجدداً.")}</Bubble>
      </div>
    ),
  },
  marker: {
    render: (_, { t }) => (
      <div className="flex w-full max-w-md flex-col gap-4">
        <Marker>{t("Today", "اليوم")}</Marker>
        <Marker variant="system">{t("Sara Hassan joined the conversation", "انضمت سارة حسن إلى المحادثة")}</Marker>
        <div className="flex justify-center">
          <Marker variant="status">{t("Request SR-20481 resolved", "تم حل الطلب SR-20481")}</Marker>
        </div>
      </div>
    ),
  },
  message: {
    render: (_, { t }) => (
      <div className="flex w-full max-w-md flex-col gap-5">
        <Message name="Sara Hassan" time="09:41">
          {t("I've restarted the line from our side. Can you check now?", "أعدت تشغيل الخط من جهتنا. هل يمكنك التحقق الآن؟")}
        </Message>
        <Message name="Omar Kareem" time="09:43" from="me">
          {t("Working again, thank you!", "يعمل مجدداً، شكراً!")}
        </Message>
      </div>
    ),
  },
  "message-scroller": {
    render: (_, { t }) => (
      <MessageScroller>
        <Marker>{t("Yesterday", "أمس")}</Marker>
        {Array.from({ length: 6 }, (_, i) =>
          i % 2 === 0 ? (
            <Message key={i} name="Sara Hassan" time={`09:${40 + i}`} footer={false}>
              {t("Checking the line on node BGD-14.", "أتحقق من الخط على العقدة BGD-14.")}
            </Message>
          ) : (
            <Message key={i} name="Omar Kareem" time={`09:${40 + i}`} from="me">
              {t("Thanks, still slow here.", "شكراً، ما زال بطيئاً.")}
            </Message>
          ),
        )}
        <Marker>{t("Today", "اليوم")}</Marker>
        <Message name="Sara Hassan" time="08:02">
          {t("Fixed overnight. Speeds are back to 100 Mbps.", "تم الإصلاح ليلاً. عادت السرعة إلى 100 ميجابت.")}
        </Message>
      </MessageScroller>
    ),
  },
  trace: {
    render: (_, { t }) => (
      <Trace
        steps={[
          { label: t("Looked up account", "البحث عن الحساب"), detail: "Al-Noor Clinic · SR-20481", state: "done" },
          { label: t("Checked line status", "فحص حالة الخط"), detail: t("Node BGD-14 · 38% packet loss at 20:00", "العقدة BGD-14 · فقدان 38% عند 20:00"), state: "done" },
          { label: t("Comparing with nearby customers", "المقارنة مع العملاء القريبين"), detail: t("12 of 40 checked", "تم فحص 12 من 40"), state: "running" },
          { label: t("Draft a reply", "صياغة رد"), detail: t("Waiting", "بانتظار"), state: "pending" },
        ]}
      />
    ),
  },
};

export const hasDemo = (slug: string) => slug in demos;

export function getDemo(slug: string): Demo {
  return (
    demos[slug] ?? {
      render: () => (
        <div className="flex flex-col items-center gap-2 text-sm text-ink-2">
          <FileSearch className="size-6" />
          No live preview yet.
        </div>
      ),
    }
  );
}

export function defaultValues(d: Demo): Values {
  return Object.fromEntries((d.controls ?? []).map((c) => [c.name, c.default]));
}
