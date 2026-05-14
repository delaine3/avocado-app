"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useState } from "react";
import Spinner from "./Spinner";

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  spinnerLabel?: string;
};

export default function LoadingLink({
  href,
  children,
  className,
  spinnerLabel = "Opening page",
}: LoadingLinkProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    setLoading(true);
    router.push(href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={loading}
      className={className}
    >
      <span className="inline-flex items-center gap-2">
        {loading && <Spinner label={spinnerLabel} />}
        {children}
      </span>
    </Link>
  );
}
