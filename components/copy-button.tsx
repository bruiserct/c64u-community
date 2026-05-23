"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label ? `Copied ${label}` : "Copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — clipboard blocked?");
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={onCopy} aria-label="Copy">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}
