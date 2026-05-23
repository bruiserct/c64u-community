import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/copy-button";
import {
  bvtermDialString,
  getAllBbses,
  getBbsBySlug,
  recommendedTerminalMode,
} from "@/lib/bbses";

export const revalidate = 3600;

export async function generateStaticParams() {
  const all = await getAllBbses();
  return all.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const bbs = await getBbsBySlug(slug);
  if (!bbs) return {};
  return {
    title: bbs.name,
    description: bbs.description.split("\n").join(" ").slice(0, 200),
  };
}

export default async function BbsDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const bbs = await getBbsBySlug(slug);
  if (!bbs) notFound();

  const dialString = bvtermDialString(bbs);
  const recommended = recommendedTerminalMode(bbs);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link href="/">
          <ChevronLeft className="size-4" />
          Back to directory
        </Link>
      </Button>

      <header className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {bbs.country}
          </Badge>
          {bbs.established ? (
            <Badge variant="outline" className="font-mono text-xs">
              est. {bbs.established}
            </Badge>
          ) : null}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{bbs.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {bbs.host}:{bbs.port}
          {bbs.sysop ? ` · sysop ${bbs.sysop}` : ""}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line text-sm leading-relaxed">
              {bbs.description}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bbs.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">
                BVTerm 2026 recommended config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-mono text-xs text-muted-foreground">Term</p>
                <p className="font-mono">{recommended}</p>
              </div>
              <Separator />
              <div>
                <p className="font-mono text-xs text-muted-foreground">Baud</p>
                <p className="font-mono">{bbs.baud_recommended}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground">Dial</p>
                <div className="flex items-center gap-2">
                  <code className="block flex-1 overflow-x-auto rounded bg-muted px-2 py-1 font-mono text-xs">
                    {dialString}
                  </code>
                  <CopyButton text={dialString} label="dial string" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Terminal modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bbs.terminal_modes.map((m) => (
                  <Badge
                    key={m}
                    variant={m === recommended ? "default" : "outline"}
                    className="font-mono text-[11px]"
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {bbs.homepage ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Homepage</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={bbs.homepage} target="_blank" rel="noreferrer">
                    {new URL(bbs.homepage).hostname}
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
