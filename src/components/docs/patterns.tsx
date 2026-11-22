"use client";

import { useState, type ReactNode } from "react";
import { Download, Filter, Inbox, Languages, Plus, SearchX } from "@scopesky/ui/icons";
import { cn } from "@scopesky/ui/utils";
import { Button } from "@scopesky/ui/button";
import { Checkbox, Dropdown, FileUploader, FormGroup, PasswordInput, RadioGroup, TextArea, TextInput } from "@scopesky/ui/fields";
import { Empty, Notification, ProgressIndicator } from "@scopesky/ui/feedback";
import { DataTable } from "@scopesky/ui/data";
import { Pagination, Tabs } from "@scopesky/ui/navigation";
import { Sheet, sBtn } from "@scopesky/ui/overlays";
import type { UITheme } from "./playground";

type T = (en: string, ar: string) => string;

export function PatternFrame({ children, defaultRtl = false, title }: { children: (t: T) => ReactNode; defaultRtl?: boolean; title: string }) {
  const [rtl, setRtl] = useState(defaultRtl);
  const [theme, setTheme] = useState<UITheme>("white");
  const t: T = (en, ar) => (rtl ? ar : en);
  return (
    <section aria-label={title} className="overflow-hidden rounded-box border border-line">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-bg px-3 py-2">
        <span className="me-auto text-sm font-semibold text-ink">{title}</span>
        <select aria-label="Preview theme" value={theme} onChange={(e) => setTheme(e.target.value as UITheme)} className="h-8 rounded-md border border-line bg-bg px-2 text-xs text-ink">
          <option value="white">White</option>
          <option value="g10">Gray 10</option>
          <option value="g90">Gray 90</option>
          <option value="g100">Gray 100</option>
        </select>
        <button type="button" aria-pressed={rtl} onClick={() => setRtl(!rtl)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors", rtl ? "border-focus bg-tint text-ink" : "border-line text-ink-2 hover:text-ink")}>
          <Languages className="size-3.5" /> Arabic / RTL
        </button>
      </div>
      <div data-ui-theme={theme} dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ar" : "en"} className="bg-layer text-ink">
        {children(t)}
      </div>
    </section>
  );
}

export function SignInPattern() {
  const [method, setMethod] = useState("Phone");
  const [error, setError] = useState(false);
  return (
    <PatternFrame title="Sign-in" defaultRtl>
      {(t) => (
        <div className="grid min-h-[560px] md:grid-cols-[1fr_1.1fr]">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#004969] p-10 text-white md:flex">
            <svg aria-hidden viewBox="0 0 400 400" className="absolute -bottom-20 -end-20 size-[420px] opacity-60">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle key={i} cx="400" cy="400" r={60 + i * 55} fill="none" stroke="#0094DA" strokeOpacity={0.5 - i * 0.07} strokeWidth="1.5" />
              ))}
            </svg>
            <p className="text-sm font-semibold">ScopeSky</p>
            <div className="relative">
              <p className="text-3xl font-light leading-snug">{t("Manage your lines, invoices and requests in one place.", "أدِر خطوطك وفواتيرك وطلباتك من مكان واحد.")}</p>
              <p className="mt-4 text-sm text-[#9dd8f3]">{t("Business and home customers", "عملاء الأعمال والمنازل")}</p>
            </div>
          </div>
          <div className="flex items-center justify-center bg-bg p-6 sm:p-12">
            <form
              className="flex w-full max-w-sm flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setError(true);
              }}
            >
              <div>
                <h3 className="text-[1.75rem] text-ink">{t("Sign in", "تسجيل الدخول")}</h3>
                <p className="mt-1 text-sm text-ink-2">
                  {t("New to ScopeSky? ", "جديد في سكوب سكاي؟ ")}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-link hover:underline">
                    {t("Create an account", "أنشئ حساباً")}
                  </a>
                </p>
              </div>
              {error && <Notification kind="error" title={t("Sign-in failed", "فشل تسجيل الدخول")} subtitle={t("The number or password is wrong. Try again or reset your password.", "الرقم أو كلمة المرور غير صحيحة. حاول مجدداً أو أعد تعيين كلمة المرور.")} onClose={() => setError(false)} />}
              <RadioGroup legend={t("Sign in with", "تسجيل الدخول بواسطة")} orientation="horizontal" options={["Phone", "Email"]} labels={{ Phone: t("Phone", "الهاتف"), Email: t("Email", "البريد الإلكتروني") }} value={method} onChange={setMethod} />
              {method === "Phone" ? <TextInput label={t("Phone number", "رقم الهاتف")} placeholder="0770 000 0000" inputMode="tel" dir="ltr" /> : <TextInput label={t("Email address", "البريد الإلكتروني")} placeholder="name@example.com" type="email" dir="ltr" />}
              <PasswordInput label={t("Password", "كلمة المرور")} />
              <div className="flex items-center justify-between">
                <Checkbox label={t("Remember me", "تذكرني")} checked onChange={() => {}} />
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-link hover:underline">
                  {t("Forgot password?", "نسيت كلمة المرور؟")}
                </a>
              </div>
              <Button type="submit" full>
                {t("Sign in", "تسجيل الدخول")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </PatternFrame>
  );
}

export function DataViewPattern() {
  const [sheet, setSheet] = useState(false);
  return (
    <PatternFrame title="Data view">
      {(t) => (
        <div className="flex flex-col gap-6 bg-bg p-4 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-ink-2">{t("Home / Service requests", "الرئيسية / طلبات الخدمة")}</p>
              <h3 className="mt-1 text-[1.75rem] text-ink">{t("Service requests", "طلبات الخدمة")}</h3>
            </div>
            <div className="flex gap-2">
              <Button kind="tertiary" size="md" icon={<Download />}>
                {t("Export", "تصدير")}
              </Button>
              <Button size="md" icon={<Plus />} onClick={() => setSheet(true)}>
                {t("New request", "طلب جديد")}
              </Button>
            </div>
          </div>
          <Tabs
            label={t("Request status", "حالة الطلب")}
            tabs={[
              { label: t("All", "الكل") + " (6)", content: <DataTable title={t("All requests", "كل الطلبات")} description={t("Sorted by newest first.", "مرتبة من الأحدث.")} zebra /> },
              { label: t("Open", "مفتوحة") + " (3)", content: <DataTable title={t("Open requests", "الطلبات المفتوحة")} description="" tone="sky" /> },
              { label: t("Closed", "مغلقة") + " (3)", content: <Empty icon={<Inbox />} title={t("No closed requests this month", "لا طلبات مغلقة هذا الشهر")} body={t("Closed requests stay here for 12 months.", "تبقى الطلبات المغلقة هنا 12 شهراً.")} /> },
            ]}
          />
          <Pagination total={6} />
          <Sheet
            open={sheet}
            onOpenChange={setSheet}
            title={t("New request", "طلب جديد")}
            description={t("We reply within one working day.", "نرد خلال يوم عمل واحد.")}
            footer={
              <>
                <button type="button" className={sBtn.outline} onClick={() => setSheet(false)}>
                  {t("Cancel", "إلغاء")}
                </button>
                <button type="button" className={sBtn.primary} onClick={() => setSheet(false)}>
                  {t("Send request", "إرسال الطلب")}
                </button>
              </>
            }
          >
            <div className="flex flex-col gap-4 pb-6">
              <TextInput label={t("Customer", "العميل")} placeholder="Al-Noor Clinic" />
              <TextArea label={t("What do you need?", "ما الذي تحتاجه؟")} maxCount={300} />
            </div>
          </Sheet>
        </div>
      )}
    </PatternFrame>
  );
}

export function RequestFormPattern() {
  const [sent, setSent] = useState(false);
  return (
    <PatternFrame title="Request form">
      {(t) => (
        <div className="grid gap-8 bg-bg p-4 sm:p-8 lg:grid-cols-[14rem_1fr]">
          <ProgressIndicator
            vertical
            current={1}
            steps={[{ label: t("Service", "الخدمة") }, { label: t("Details", "التفاصيل") }, { label: t("Documents", "المستندات") }, { label: t("Review", "المراجعة") }]}
          />
          <form
            className="flex max-w-xl flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent && <Notification kind="success" title={t("Request sent", "تم إرسال الطلب")} subtitle={t("Reference SR-20482. We will call you within one working day.", "المرجع SR-20482. سنتصل بك خلال يوم عمل واحد.")} onClose={() => setSent(false)} />}
            <FormGroup legend={t("Contact", "التواصل")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label={t("Full name", "الاسم الكامل")} placeholder="Sara Hassan" />
                <TextInput label={t("Phone number", "رقم الهاتف")} placeholder="0770 000 0000" dir="ltr" />
              </div>
            </FormGroup>
            <FormGroup legend={t("Request", "الطلب")}>
              <Dropdown label={t("Request type", "نوع الطلب")} options={["New line", "Move my line", "Upgrade plan", "Fault report"]} initial="Upgrade plan" />
              <TextArea label={t("Details", "التفاصيل")} placeholder={t("Tell us what you need", "أخبرنا بما تحتاجه")} maxCount={500} />
            </FormGroup>
            <FileUploader title={t("Supporting documents", "مستندات داعمة")} />
            <div className="flex gap-px">
              <Button kind="secondary" className="flex-1">
                {t("Back", "رجوع")}
              </Button>
              <Button type="submit" className="flex-1">
                {t("Send request", "إرسال الطلب")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PatternFrame>
  );
}

export function EmptyStatesPattern() {
  return (
    <PatternFrame title="Empty states">
      {(t) => (
        <div className="grid gap-6 bg-bg p-4 sm:p-8 md:grid-cols-2">
          <div className="flex flex-col items-center gap-3">
            <p className="self-start text-xs text-ink-2">{t("First use", "الاستخدام الأول")}</p>
            <Empty
              icon={<Inbox />}
              title={t("No requests yet", "لا توجد طلبات بعد")}
              body={t("When you open a service request, it shows up here with its status.", "عندما تفتح طلب خدمة، يظهر هنا مع حالته.")}
              action={
                <button type="button" className={sBtn.primary}>
                  <Plus className="size-4" /> {t("New request", "طلب جديد")}
                </button>
              }
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="self-start text-xs text-ink-2">{t("No search results", "لا نتائج بحث")}</p>
            <Empty
              icon={<SearchX />}
              title={t("Nothing matches “fibre 2”", "لا شيء يطابق “fibre 2”")}
              body={t("Check the spelling, or remove a filter to see more requests.", "تحقق من الإملاء، أو أزل عامل تصفية لرؤية المزيد.")}
              action={
                <button type="button" className={sBtn.outline}>
                  <Filter className="size-4" /> {t("Clear filters", "مسح عوامل التصفية")}
                </button>
              }
            />
          </div>
        </div>
      )}
    </PatternFrame>
  );
}
