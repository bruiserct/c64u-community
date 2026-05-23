import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About",
  description:
    "About the C64U BBS Directory and its relationship to BVTerm 2026.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 space-y-3">
        <Badge variant="outline" className="font-mono text-xs">
          about
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          What this is
        </h1>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed">
        <p>
          The C64U BBS Directory is a community-maintained catalog of telnet
          BBSes that work well with the Commodore 64 Ultimate. Every
          listing includes the practical bits you need to actually dial in
          from a real C64U: which terminal mode to pick, what baud rate to
          use, and the exact{" "}
          <code className="font-mono">ATDT</code> dial string.
        </p>

        <h2>Why this exists</h2>
        <p>
          The existing telnet-BBS lists out there (Telnet BBS Guide,
          scattered csdb.dk threads, the usual social-media posts) don&apos;t
          tell a C64U user the things they actually need to know — like
          whether a board renders correctly in ANSI-wide vs ANSI-40, or
          which baud rate the sysop has tested with modern 6551 ACIA
          emulations. This directory fills that gap.
        </p>

        <h2>How it relates to BVTerm 2026</h2>
        <p>
          <a
            href="https://github.com/bruiserct/BVTerm2026"
            target="_blank"
            rel="noreferrer"
            className="font-mono"
          >
            BVTerm 2026
          </a>{" "}
          is an 80-column ANSI terminal program for the C64U, reauthored
          from Striketerm 2014. This directory is its companion — every
          BBS detail page surfaces a config snippet matching BVTerm
          2026&apos;s Term picker.
        </p>

        <h2>How the data is maintained</h2>
        <p>
          The BBS list lives in{" "}
          <code className="font-mono">data/bbses.yaml</code> in the public
          GitHub repository. Submissions land as GitHub issues or pull
          requests. A maintainer reviews each submission for correctness
          (the BBS exists, is dialable, and the terminal-mode info is
          plausible) and then merges. The site rebuilds automatically on
          the next deploy.
        </p>

        <h2>What&apos;s next</h2>
        <p>
          Future work — live status pings, an embedded ANSI screenshot
          gallery, sysop-claimed listings, and a small REST API so other
          tools (and a possible BVTerm 2026 in-app browser) can consume
          the directory.
        </p>
      </div>

      <Card className="mt-10">
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <p className="text-sm text-muted-foreground">
            Source &amp; submissions on GitHub
          </p>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://github.com/bruiserct/c64u-community"
              target="_blank"
              rel="noreferrer"
            >
              bruiserct/c64u-community
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="underline">
          ← Back to directory
        </Link>
      </p>
    </div>
  );
}
