"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CSSProperties, MouseEvent, ReactNode, useState } from "react";
import Spinner from "./Spinner";

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  spinnerLabel?: string;
  onClick?: () => void;
};

export default function LoadingLink({
  href,
  children,
  className,
  style,
  spinnerLabel = "Opening page",
  onClick,
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

    onClick?.();

    setLoading(true);
    router.push(href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={loading}
      className={className}
      style={style}
    >
      <span className="inline-flex items-center gap-2">
        {loading && <Spinner label={spinnerLabel} />}
        {children}
      </span>
    </Link>
  );
}
