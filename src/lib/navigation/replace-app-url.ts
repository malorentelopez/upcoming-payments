/** Update the URL without triggering a Next.js navigation / RSC refetch. */
export function replaceAppUrl(pathname: string, searchParams: URLSearchParams) {
  if (typeof window === "undefined") {
    return;
  }

  const query = searchParams.toString();
  const nextUrl = query ? `${pathname}?${query}` : pathname;
  window.history.replaceState(window.history.state, "", nextUrl);
}
