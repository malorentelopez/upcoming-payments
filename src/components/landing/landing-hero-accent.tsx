/** Decorative ghost of the dashboard hero — sits behind copy, no layout height. */
export function LandingHeroAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[22%] z-0 flex justify-center md:top-[20%]"
    >
      <div className="relative w-52 rotate-[-4deg] opacity-[0.35] dark:opacity-[0.25] md:w-60 md:rotate-[-3deg]">
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/5 to-card/90 p-4 shadow-2xl shadow-primary/10 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="h-2 w-16 rounded-full bg-primary/60" />
              <div className="h-1.5 w-24 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="h-5 w-12 rounded-full bg-muted/60" />
          </div>
          <div className="mt-3 h-7 w-28 rounded-md bg-primary/40" />
        </div>

        <div className="absolute -bottom-5 left-3 right-3 space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/80 p-2.5 shadow-sm">
            <div className="h-8 w-7 shrink-0 rounded-md bg-primary/30" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-2 w-20 rounded-full bg-foreground/20" />
              <div className="h-1.5 w-14 rounded-full bg-muted-foreground/25" />
            </div>
            <div className="h-2 w-10 rounded-full bg-foreground/15" />
          </div>
          <div className="ml-4 flex items-center gap-2 rounded-xl border border-border/30 bg-card/60 p-2.5 opacity-80">
            <div className="h-8 w-7 shrink-0 rounded-md bg-indigo-400/30" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-2 w-16 rounded-full bg-foreground/15" />
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
