"use client";
import CoWorkForm from "@/components/admin/EditCoWorkForm";
import PreviewCard from "@/components/admin/PreviewCard";
import React, { useEffect, useState } from "react";
import { useCardContext } from "@/context/CardContext";
import { useSession } from "next-auth/react";
import { Route } from "lucide-react";
import { useRouter } from "next/navigation";
import getUserProfile from "@/libs/getUserProfile";
import getSpace from "@/libs/getSpace";
import Preview from "@/components/admin/EditPreviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "antd";
export default function page({ params }: { params: { id: string } }) {
  const [space, setSpace] = useState<any>(null);
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const space = await getSpace(params.id);
        setSpace(space);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpace();
  });

  return (
    <div className="p-10">
      <div className="mt-10 mb-10 text-5xl font-medium">
        Manage Co-working Space
      </div>
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
          <div className="font-bold text-2xl mb-5">Edit Working Space</div>
          {space ? (
            <CoWorkForm data={space.data} />
          ) : (
            <div className=" bg-white rounded-2xl shadow-2xl">
              <form className="p-20 grid grid-cols-4 gap-10 ">
                <label htmlFor="image-upload">รูปภาพ:</label>
                <Input
                  disabled
                  type="text"
                  className="col-span-2 text-xs max-w-60 text-gray-400"
                  placeholder="Image Url"
                />
                <div className="col-span-1"></div>
                <label>ชื่อ:</label>
                <Input
                  disabled
                  type="text"
                  placeholder="co-working space's name"
                  className="col-span-3 "
                  maxLength={25}
                  id="Edit-name"
                />
                <label>เวลาเปิด:</label>
                <div className="col-span-3 flex gap-3">
                  <TimePicker className=" " id="Edit-openTime" disabled minuteStep={30} />
                  <div className="text-center self-center">ถึง</div>
                  <TimePicker className=" " id="Edit-closeTime" disabled minuteStep={30} />
                </div>
                <label>รายละเอียด:</label>
                <Textarea
                  disabled
                  className="col-span-3 "
                  placeholder="co-working space's detail"
                />
                <label>จำนวนที่นั่ง:</label>
                <div className="flex flex-col">
                  <Input
                    disabled
                    required
                    type="number"
                    placeholder="Max seats"
                    className=" rounded-lg p-3"
                    id="Edit-maxSeat"
                    min={1}
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-3"></div>
                <Input
                  disabled
                  type="submit"
                  className="cursor-pointer flex justify-center rounded-full text-md w-36 transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                />
              </form>
            </div>
          )}
        </div>
        <div>
          <div className="font-bold text-2xl flex justify-end mb-12"></div>
          <div className="flex justify-center">
            {/* <PreviewCard card={card} /> */}
            {space ? (
              <Preview data={space.data} />
            ) : (
              <div className="h-[520px] relative flex flex-col text-gray-700 bg-white shadow-xl bg-clip-border justify-between rounded-2xl w-96 p-3">
                <div>
                  <Skeleton className="shadow-xl h-[190px] w-[360px] bg-[#E5E7EB] rounded-2xl" />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
