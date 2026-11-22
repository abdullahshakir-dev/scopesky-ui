import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-5 py-24 sm:px-10">
      <p className="font-mono text-sm text-eyebrow">404</p>
      <h1 className="text-[2.625rem] font-normal leading-tight text-ink">This page doesn’t exist</h1>
      <p className="text-base text-ink-2">The link may be old, or the component may have a new name. Search with Ctrl K, or start from the catalog.</p>
      <NextLink href="/docs/components" className="mt-2 inline-flex h-12 items-center bg-primary px-4 text-sm text-on-color hover:bg-primary-hover">
        Browse all components
      </NextLink>
    </div>
  );
}
