import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NEW_ISSUE_TEMPLATE = `
**BBS name**:
**Telnet host:port** (e.g. \`bbs.example.org:6400\`):
**Sysop handle** (optional):
**Established** (year, optional):
**Description** (1–3 paragraphs):

**Terminal modes that work well** (check any that apply — these match BVTerm 2026's Term picker):
- [ ] ANSI-40
- [ ] ANSI-wide
- [ ] VT102
- [ ] VT102-wide
- [ ] Standard-40
- [ ] Standard-80
- [ ] Std-80-wide
- [ ] Commodore
- [ ] VT52

**Recommended baud rate**: 2400 / 9600 / 38400

**Tags** (comma-separated, e.g. \`scene, ansi-art, chat\`):
**ANSI style**: petscii / ascii / ansi / mixed
**Country** (ISO-3166 2-letter, e.g. US / DE / AU):
**Homepage URL** (optional):
**Your handle** (optional, credit on the listing):
`.trim();

const issueUrl =
  "https://github.com/bruiserct/c64u-community/issues/new?" +
  new URLSearchParams({
    title: "Submit: <BBS NAME>",
    body: NEW_ISSUE_TEMPLATE,
    labels: "bbs-submission",
  }).toString();

const editYamlUrl =
  "https://github.com/bruiserct/c64u-community/edit/main/data/bbses.yaml";

export const metadata = {
  title: "Submit a BBS",
  description:
    "Submit a telnet BBS to the C64U community directory. Submissions land as GitHub issues or PRs.",
};

export default function SubmitPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 space-y-3">
        <Badge variant="outline" className="font-mono text-xs">
          community curated
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Submit a BBS</h1>
        <p className="text-balance text-muted-foreground">
          This directory is maintained as a YAML file in a public GitHub
          repository. Submissions land as GitHub issues (easiest) or as
          pull requests against{" "}
          <span className="font-mono text-foreground">data/bbses.yaml</span>{" "}
          (faster path for sysops).
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open a GitHub issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              No git knowledge needed. Fill in the form on GitHub; a
              maintainer adds it to the YAML.
            </p>
            <Button asChild className="w-full">
              <a href={issueUrl} target="_blank" rel="noreferrer">
                New submission issue
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Edit the YAML directly</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Fork the repo, edit{" "}
              <span className="font-mono">data/bbses.yaml</span>, open a PR.
              CI validates the schema via{" "}
              <span className="font-mono text-foreground">zod</span> at build
              time.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href={editYamlUrl} target="_blank" rel="noreferrer">
                Edit data/bbses.yaml
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Submission guidelines
        </h2>
        <ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">
          <li>
            The BBS must be a real, dialable telnet BBS — no commercial
            paywalls.
          </li>
          <li>
            Specify which terminal modes work well — these directly map to
            BVTerm 2026&apos;s Term picker (ANSI-wide, ANSI-40, etc.).
          </li>
          <li>
            Recommend the baud rate you&apos;ve verified works on a real C64U
            (typically 38400 with SwiftLink emulation).
          </li>
          <li>
            ANSI style helps the directory display correctly — pick{" "}
            <span className="font-mono">ansi</span> for color/CP437,{" "}
            <span className="font-mono">petscii</span> for native C-set,{" "}
            <span className="font-mono">ascii</span> for plain text only,{" "}
            <span className="font-mono">mixed</span> for boards that switch.
          </li>
          <li>
            Submissions go through a quick maintainer review before
            appearing on the site.
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Questions?{" "}
          <Link href="/about" className="underline">
            About this directory
          </Link>{" "}
          ·{" "}
          <a
            href="https://github.com/bruiserct/c64u-community"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Repository
          </a>
        </p>
      </section>
    </div>
  );
}
