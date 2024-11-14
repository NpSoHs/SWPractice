"use client";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function Booking() {
  const router = useRouter();
  router.push("/");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress />
    </div>
  );
}
