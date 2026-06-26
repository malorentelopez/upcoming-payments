export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100dvh-1.5rem-var(--mobile-bottom-clearance))] min-h-0 flex-col overflow-hidden max-md:-mb-mobile-nav md:mb-0 md:h-auto md:overflow-visible">
      {children}
    </div>
  );
}
