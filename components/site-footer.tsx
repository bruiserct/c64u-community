import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            C64U BBS Directory · Companion to{" "}
            <a
              href="https://github.com/bruiserct/BVTerm2026"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-foreground hover:underline"
            >
              BVTerm 2026
            </a>
          </p>
          <p className="font-mono">
            <Link href="/submit" className="hover:underline">
              submit a bbs
            </Link>
            <span aria-hidden> · </span>
            <Link href="/about" className="hover:underline">
              about
            </Link>
            <span aria-hidden> · </span>
            <a
              href="https://github.com/bruiserct/c64u-community"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              github
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
