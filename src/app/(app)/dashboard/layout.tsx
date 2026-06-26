export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100dvh-1.5rem-7rem-env(safe-area-inset-bottom,0px))] min-h-0 flex-col overflow-hidden max-md:-mb-28 md:mb-0 md:h-auto md:overflow-visible">
      {children}
    </div>
  );
}
