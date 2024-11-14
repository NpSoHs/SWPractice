"use client";
import PreviewCard from "@/components/admin/PreviewCard";
import getSpaces from "@/libs/getSpaces";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SpaceJson } from "../../../interface";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getUserProfile from "@/libs/getUserProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function page() {
  const [spaces, setSpaces] = useState<SpaceJson>();
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await getSpaces();
        setSpaces(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpace();
  });

  return (
    <div className="p-10">
      <div className="flex justify-center mt-10 mb-5 text-5xl font-bold">
          <span className="bg-gradient-to-b pb-14 from-blue-700 to-blue-400 bg-clip-text text-transparent">
            Manage Co-working Space
          </span>
      </div>
        <div className="flex justify-center mb-10">
          <Link
            href="/adminpage/create"
            className="align-middle select-none text-lg font-semibold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-2 px-12 rounded-full bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            Add
          </Link>
        </div>
      {spaces ? (
        <div className="grid grid-cols-4 justify-items-center gap-10">
          {spaces?.data.map((i: any) => <PreviewCard card={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-4 justify-items-center gap-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="h-[520px] relative flex flex-col text-gray-700 bg-white shadow-xl bg-clip-border justify-between rounded-2xl w-full p-3">
              <div>
                <Skeleton className="shadow-xl h-[190px] w-full bg-[#E5E7EB] rounded-2xl" />
                <div className="p-4">
                  <Skeleton className="shadow-xl h-6 w-44 bg-[#E5E7EB] rounded-2xl" />
                </div>
                <div className="px-4">
                  <hr />
                </div>
                <div className="flex flex-col gap-3 px-4 mt-6">
                  <Skeleton className="shadow-xl h-3 w-72 bg-[#E5E7EB] rounded-2xl" />
                  <Skeleton className="shadow-xl h-3 w-60 bg-[#E5E7EB] rounded-2xl" />
                  <Skeleton className="shadow-xl h-3 w-72 bg-[#E5E7EB] rounded-2xl" />
                  <Skeleton className="shadow-xl h-3 w-60 bg-[#E5E7EB] rounded-2xl" />
                  <Skeleton className="shadow-xl h-3 w-40 bg-[#E5E7EB] rounded-2xl" />
                </div>
                <div className="mt-8 px-4">
                  <Skeleton className="shadow-xl h-6 w-44 bg-[#E5E7EB] rounded-2xl" />
                </div>
                <div className="flex justify-end px-4 mt-1">
                  <Skeleton className="shadow-xl h-9 w-28 bg-[#E5E7EB] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
