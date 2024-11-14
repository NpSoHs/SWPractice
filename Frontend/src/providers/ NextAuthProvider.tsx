"use client"
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
  session: any;
}

export default function NextAuthProvider({
  children,
  session,
}: Props): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
