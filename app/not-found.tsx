import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-16">
      <p className="font-mono text-sm text-muted-foreground">404 NO CARRIER</p>
      <h1 className="text-3xl font-bold tracking-tight">Not in the directory</h1>
      <p className="text-muted-foreground">
        That BBS isn&apos;t listed yet — or you mistyped a slug. Either way,
        back to the directory:
      </p>
      <Button asChild>
        <Link href="/">Back to directory</Link>
      </Button>
    </div>
  );
}
