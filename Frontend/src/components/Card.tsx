"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { SpaceItem } from "../../interface";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import checkAvailableSeat from "@/libs/checkAvailableSeat";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// // Set the default timezone to your country's timezone
// dayjs.tz.setDefault('Asia/Bangkok');
interface Props {
  data: SpaceItem;
}

export default function Card({ data }: Props) {
  const [availableSeat, setAvailableSeat] = useState<number | null>(null);
  if (!data) return;
  useEffect(() => {
    const fetchAvailable = async () => {
      const availableSeat = await checkAvailableSeat(data.id || "", {
        startTime: dayjs(),
        endTime: dayjs().add(2, "hour"),
      });
      if (!availableSeat) return;
      setAvailableSeat(availableSeat.availableSeats);
    };
    fetchAvailable();
  }, []);

  return (
    <div className="relative hover:-translate-y-1 duration-150 cursor-pointer ">
      <div
        className="bg-gray-200 w-full h-80 rounded-3xl shadow-xl"
        style={{
          backgroundImage: `url(${data.image})`,
          backgroundSize: "cover",
        }}
      ></div>
      {availableSeat === null ? (
        <div className="flex text-sm items-center gap-2 absolute top-5 left-5 bg-white px-3 py-1 rounded-full text-gray-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-700"></span>
          </span>
          Loading
        </div>
      ) : availableSeat !== null && availableSeat > 0 ? (
        <div className="flex text-sm items-center gap-2 absolute top-5 left-5 bg-white px-3 py-1 rounded-full text-green-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          available
        </div>
      ) : (
        <div className="flex text-sm items-center gap-2 absolute top-5 left-5 bg-white px-3 py-1 rounded-full text-red-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          occupied
        </div>
      )}

      <div className="flex justify-between mt-3 mx-2 text-gray-600">
        <h1>{data.name}</h1>
        <div className="flex items-center gap-2">
          <FaClock />
          <p>
            {dayjs(data.openTime).tz("Asia/Bangkok").format("HH:mm")} -{" "}
            {dayjs(data.closeTime).tz("Asia/Bangkok").format("HH:mm")}
           
          </p>
        </div>
      </div>
    </div>
  );
}
