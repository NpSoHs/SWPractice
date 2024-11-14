"use client";
import getSpaces from "@/libs/getSpaces";
import Banner from "../components/Banner";
import Card from "@/components/Card";
import Link from "next/link";
import { SpaceItem, SpaceJson } from "../../interface";
import ModalCreateNew from "@/components/admin/ModalCreateNew";
import ModalCreateNewHandle from "@/components/admin/ModalCreateNewHandle";
import checkAvailableSeat from "@/libs/checkAvailableSeat";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CiCircleQuestion } from "react-icons/ci";
import getUserReservationQuota from "@/libs/getUserReservationQuota";
import { useSession } from "next-auth/react";

export default function Home() {
  const [spaces, setSpaces] = useState<SpaceJson>();
  const [quota, setQuota] = useState<null | number>(null);

  const { data: session } = useSession();

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
  }, []);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const userQuota = await getUserReservationQuota(session!.user.token);
        setQuota(userQuota.data);
      } catch {
        console.error("Error fetching quota");
      }
    };
    fetchQuota();
  }, []);

  return (
    <main>
      <Banner />
      <div className="-mt-96 pt-96  pb-20 bg-white">
        <div className="mx-20" id="booking">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl text-">Available Co-working Space</h1>
            <HoverCard>
              <HoverCardTrigger>
                <div className="bg-slate-100 py-2 px-4 rounded-full duration-200 hover:bg-slate-200 flex items-center gap-2">
                  <span className="">Reservation Quota</span>
                  <span
                    className={clsx(
                      "font-extrabold",
                      quota !== 0 ? "text-sky-500" : "text-gray-300"
                    )}
                  >
                    {quota !== null ? quota : "-"}
                  </span>
                  <CiCircleQuestion
                    className="text-gray-500"
                    size={16}
                    strokeWidth={0.75}
                  />
                </div>
              </HoverCardTrigger>

              <HoverCardContent>
                <h2 className="font-bold text-sky-500">
                  What's Reservation Quota?
                </h2>
                <p className="text-gray-500 font-sm">
                  You can make 3 reservations per day for co-working spaces.
                  Once you exceeded your quota you can find another free days
                  Hope you productive! 🌟
                </p>
                <hr className="my-3" />
                <div className="flex-col w-full text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    {quota}
                  </div>
                </div>

                <span className="text-gray-400 text-xs">Max Quota/Day: 3</span>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="grid grid-cols-4 gap-9 py-10">
            {spaces
              ? spaces.data.map((item: SpaceItem) => (
                  <Link key={item.id} href={`/space/${item._id}`}>
                    <Card data={item} />
                  </Link>
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    className="bg-[#E5E7EB] w-full h-[320px] rounded-2xl "
                    key={i}
                  />
                ))}
          </div>
        </div>
      </div>
    </main>
  );
}
