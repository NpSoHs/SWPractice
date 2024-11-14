import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  href: string;
}

export default function TopMenuItem({ title, href }: Props) {
  return (
    <Link
      href={href}
      className="bg-slate-200 py-2 px-4 rounded-full duration-200 hover:bg-slate-300"
    >
      <p>{title}</p>
    </Link>
  );
}
