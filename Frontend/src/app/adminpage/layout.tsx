import React from "react";
import { CardProvider } from "@/context/CardContext";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getUserProfile from "@/libs/getUserProfile";
import { redirect } from "next/navigation";
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  var profile;

  if (session) {
    profile = await getUserProfile(session.user.token);
  }
  const isAdminOrModerator =
    profile?.data.role === "admin" || profile?.data.role === "moderator"
      ? true
      : false;
  if (!isAdminOrModerator) {
    redirect("/");
  }
  return (
    <div>
      <CardProvider>{children}</CardProvider>
    </div>
  );
}
