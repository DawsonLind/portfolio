"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; prUrl: string; summary: string }
  | { state: "error"; message: string };

const MIN_LEN = 10;

export function FeedbackLoop() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  function reset() {
    setFeedback("");
    setStatus({ state: "idle" });
  }

  async function submit() {
    if (feedback.trim().length < MIN_LEN) return;
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback: feedback.trim(),
          pageUrl:
            typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          state: "error",
          message:
            data?.error ||
            "Something went wrong on our end. Try again in a moment.",
        });
        return;
      }
      setStatus({
        state: "success",
        prUrl: data.prUrl,
        summary: data.summary || "Pull request opened.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network hiccup. Check your connection and try again.",
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        aria-label="Suggest an improvement"
        render={
          <button
            type="button"
            className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-5"
          />
        }
      >
        <MessageSquarePlus className="h-4 w-4" />
        <span className="hidden sm:inline">Improve this site</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Improve this site</DialogTitle>
          <DialogDescription>
            Spot a bug or want a change? Describe it and an AI agent will open
            a PR.
          </DialogDescription>
        </DialogHeader>

        {status.state === "success" ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground/90">{status.summary}</p>
            <div className="rounded-md border border-border bg-card/40 p-3 text-sm">
              <a
                href={status.prUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary underline-offset-4 hover:underline break-all"
              >
                {status.prUrl}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Vercel will deploy a preview shortly.
            </p>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>
                Close
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Change the hero subtitle to say 'Hello, friend.'"
              rows={5}
              disabled={status.state === "submitting"}
              className="resize-none"
            />
            {status.state === "error" && (
              <p className="text-sm text-destructive">{status.message}</p>
            )}
            <DialogFooter className="gap-2">
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    disabled={status.state === "submitting"}
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button
                onClick={submit}
                disabled={
                  status.state === "submitting" ||
                  feedback.trim().length < MIN_LEN
                }
              >
                {status.state === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reviewing your suggestion...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
