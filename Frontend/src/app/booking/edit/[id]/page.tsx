"use client";
import ModalupdateHandle from "@/components/ModalupdateHadle";
import getSpace from "@/libs/getSpace";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import getReservation from "@/libs/getsingleReservation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpaceItem } from "../../../../../interface";
import { useSession } from "next-auth/react";
import { Router } from "next/router";
import { redirect, usePathname } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, DatePickerProps } from "antd";
import TimeSelection from "@/components/ui/TimeSelectionProps";
import Swal from "sweetalert2";
import checkAvailableSeat from "@/libs/checkAvailableSeat";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateReservation from "@/libs/updateReserve";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { max } from "moment";
import { Progress } from "@/components/ui/progress";
import { start } from "repl";
import { CiCircleQuestion } from "react-icons/ci";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import clsx from "clsx";
import getUserReservationQuota from "@/libs/getUserReservationQuota";

interface Props {
  params: { id: string };
}
interface DateProps {
  startTime: Dayjs;
  endTime: Dayjs;
}

export default function ReservationDetail({ params }: Props) {
  const session = useSession();
  if (!session || !session.data?.user.token) {
    redirect("/login");
  }

  const [space, setSpace] = useState<SpaceItem>();
  const [date, setDate] = useState<Dayjs>();
  const [startTime, setStartTime] = useState<Dayjs | null>();
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [isReserve, setIsReserve] = useState(false);
  const [availableSeat, setAvailableSeat] = useState<number>(0);
  const [timeData, setTimeData] = useState<DateProps>();
  const [percent, setPercent] = useState(0);
  const [quota, setQuota] = useState<null | number>(null);

  const [dataPreFetch, setDataPreFetch] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const data = await getReservation(params.id, session.data.user.token);
        const startTime = dayjs(data.data.startTime);
        const endTime = dayjs(data.data.endTime);
        const availableseatha = await checkAvailableSeat(space?._id as any, {
          startTime,
          endTime,
        });
        if (!availableseatha) {
          throw new Error("cannot fetch");
        }
        setDataPreFetch(availableseatha.availableSeats);
      } catch (error) {
        console.error("error ja", error);
      }
    };
    fetchAvailable();
  });

  useEffect(() => {
    const fetchReserve = async () => {
      try {
        const fetchReserve = await getReservation(
          params.id,
          session.data.user.token
        );
        if (
          fetchReserve.data &&
          fetchReserve.data.startTime &&
          fetchReserve.data.endTime
        ) {
          // Set the date state with the existing reservation date
          const startTime = dayjs(fetchReserve.data.startTime);
          const endTime = dayjs(fetchReserve.data.endTime);

          setDate(dayjs(fetchReserve.data.startTime));

          setTimeData({
            startTime: startTime,
            endTime: endTime,
          });
          setStartTime(startTime);
          setEndTime(endTime);
        }
        try {
          const spacedata = await getSpace(fetchReserve.data.workingSpace._id);
          setSpace(spacedata.data);
        } catch (error) {
          console.error("Error fetching space:", error);
        }
      } catch (error) {
        console.error("Error fetching reserve:", error);
      }
    };
    fetchReserve();
  }, [params.id]);

  useEffect(() => {
    if (!date) {
      setAvailableSeat(0);
      return;
    }
    if (startTime && endTime) {
      const fetchAvailable = async () => {
        try {
          const availableseatha = await checkAvailableSeat(space?._id as any, {
            startTime,
            endTime,
          });
          if (!availableseatha) {
            throw new Error("cannot fetch");
          }
          setAvailableSeat(availableseatha.availableSeats);
        } catch (error) {
          console.error("error ja", error);
        }
      };
      fetchAvailable();
    }
  }, [startTime, endTime, params.id, isReserve]);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const userQuota = await getUserReservationQuota(
          (session as any).data?.user.token,
          date?.toString()
        );
        setQuota(userQuota.data);
      } catch {
        console.error("Error fetching quota");
      }
    };
    fetchQuota();
  }, [date, isSubmit]);

  useEffect(() => {
    if (space?.maxSeat)
      setPercent(Math.floor((availableSeat / space?.maxSeat) * 100));
  }, [availableSeat]);

  const handleReserve = async (e: any) => {
    try {
      e.preventDefault();
      if (!date) {
        Swal.fire({
          title: "Error!",
          text: "Please provide date ",
          icon: "error",
        });
        return;
      }
      if (!startTime || !endTime) {
        Swal.fire({
          title: "Error!",
          text: "Please provide time ",
          icon: "error",
        });
        return;
      }
      if (dayjs().isAfter(startTime)) {
        Swal.fire({
          title: "Error!",
          text: "Booking unavailable before current time.",
          icon: "error",
        });
        return;
      }

      if (dayjs(timeData?.startTime).isSame(startTime) && dayjs(timeData?.endTime).isSame(endTime)) {
        Swal.fire({
          title: "No update!",
          text: "No changes have been made.",
          icon: "info",
        });
        return;
      }

      if ((availableSeat as number) <= 0) {
        Swal.fire({
          title: "Error!",
          text: "The seats are fully occupied. Unable to reserve.",
          icon: "error",
        });
        return;
      }
      
      const data = {
        startTime: startTime,
        endTime: endTime,
      };
      console.log(data);
      const reservation = await UpdateReservation(
        params.id,
        session.data?.user.token,
        data as any
      );
      setIsReserve((prev) => !prev);
      setIsSubmit(!isSubmit);
      if (!reservation) {
        throw new Error("cannot create.!!");
      }
    } catch (error) {
      console.error("error update Reservation", error);
    }
  };

  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(date);
    if (date) {
      console.log(
        "starttime is " +
          date
            .hour(startTime?.hour() || 0)
            .minute(startTime?.minute() || 0)
            .format()
      );
      console.log(
        "endtime is " +
          date
            .hour(endTime?.hour() || 0)
            .minute(endTime?.minute() || 0)
            .format()
      );
      setStartTime(
        date.hour(startTime?.hour() || 0).minute(startTime?.minute() || 0)
      );
      setEndTime(
        date.hour(endTime?.hour() || 0).minute(endTime?.minute() || 0)
      );
    }
  };

  const handleTimeChange = (time: Dayjs | null, timeType: string) => {
    let timewithdate = date;
    if (date === undefined) {
      timewithdate = dayjs();
    }
    if (timewithdate) {
      if (timeType === "start") {
        setStartTime(
          time == null
            ? null
            : timewithdate
                .hour(time?.hour() || 0)
                .minute(time?.minute() || 0) || timewithdate
        );
      } else if (timeType === "end") {
        if (time == null) {
          setEndTime(null);
          return;
        }
        console.log("time is null " + (time == null));
        setEndTime(
          timewithdate.hour(time?.hour() || 0).minute(time?.minute() || 0) ||
            timewithdate
        );
      }
    }
  };

  const disabledEndTime = (current: Dayjs) => {
    let closeHour = dayjs(space?.closeTime).hour();
    let closeMinute = dayjs(space?.closeTime).minute();
    let currentTimeHour = dayjs().hour();
    return {
      disabledHours: () => {
        if (!startTime) return Array.from({ length: 24 }, (_, i) => i);
        if (!date) return Array.from({ length: 24 }, (_, i) => i);
        let timeLength = startTime.hour();
        if (startTime.minute() == 30) {
          timeLength = timeLength + 1;
        }
        let arrayOfHours = Array.from(
          { length: Math.max(0, timeLength) },
          (_, i) => i
        );
        if (date?.date() === dayjs().date()) {
          for (let i = 0; i < currentTimeHour; i++) {
            arrayOfHours.push(i);
          }
        }
        if (closeHour) {
          for (let i = closeHour + 1; i < 24; i++) {
            arrayOfHours.push(i);
          }
        }
        return arrayOfHours;
      },
      disabledMinutes: (selectedHour: number) => {
        if (!startTime) return Array.from({ length: 60 }, (_, i) => i);
        if (!date) return Array.from({ length: 60 }, (_, i) => i);
        const startHour = startTime.hour();
        const startMinute = startTime.minute();

        let arrayOfMinute = [];
        if (selectedHour === startHour) {
          for (let i = 0; i < startMinute + 1; i++) {
            arrayOfMinute.push(i);
          }
        }

        if (selectedHour === closeHour) {
          for (let i = closeMinute + 1; i < 60; i++) {
            arrayOfMinute.push(i);
          }
        }

        if (selectedHour < startHour)
          return Array.from({ length: 60 }, (_, i) => i);

        return arrayOfMinute;
      },
    };
  };

  const disabledStartTime = (current: Dayjs) => {
    let openHour = dayjs(space?.openTime).hour();
    let openMinute = dayjs(space?.openTime).minute();
    let closeHour = dayjs(space?.closeTime).hour();
    let closeMinute = dayjs(space?.closeTime).minute();
    return {
      disabledHours: () => {
        if (!dayjs(space?.openTime))
          return Array.from({ length: 24 }, (_, i) => i);
        if (!date) return Array.from({ length: 24 }, (_, i) => i);
        let currentTimeHour = dayjs().hour();
        let timeLength = openHour;
        let arrayOfHours = Array.from(
          { length: Math.max(0, timeLength) },
          (_, i) => i
        );
        if (date?.date() === dayjs().date()) {
          for (let i = 0; i < currentTimeHour; i++) {
            arrayOfHours.push(i);
          }
        }
        for (let i = closeHour + 1; i < 24; i++) {
          arrayOfHours.push(i);
        }
        return arrayOfHours;
      },
      disabledMinutes: (selectedHour: number) => {
        if (!dayjs(space?.openTime))
          return Array.from({ length: 60 }, (_, i) => i);
        if (!date) return Array.from({ length: 60 }, (_, i) => i);
        let arrayOfMinute = [];
        let currentTimeMinute = dayjs().minute();
        let currentTimeHour = dayjs().hour();
        if (date?.date() === dayjs().date()) {
        }
        if (currentTimeHour === selectedHour) {
          for (let i = 0; i < currentTimeMinute; i++) {
            arrayOfMinute.push(i);
          }
        }
        if (selectedHour === openHour) {
          for (let i = 0; i < Math.ceil(openMinute / 30); i++) {
            arrayOfMinute.push(i * 30);
          }
        }
        if (selectedHour === closeHour) {
          for (let i = closeMinute; i < 60; i++) {
            arrayOfMinute.push(i);
          }
        }

        if (selectedHour < openHour) {
          arrayOfMinute = Array.from({ length: 60 }, (_, i) => i);
        }

        return arrayOfMinute;
      },
    };
  };

  const [DataPercent, setDataPercent] = useState(0);

  useEffect(() => {
    if (space?.maxSeat)
      setDataPercent(Math.floor((dataPreFetch / space?.maxSeat) * 100));
  }, [dataPreFetch]);

  const debug = () => {
    console.log(dataPreFetch);
    console.log(availableSeat);
    console.log(timeData?.startTime);
    console.log(startTime);
  };

  return (
    <div className="flex justify-center my-20 flex-col gap-5 items-center">
      <h1 className="text-center text-4xl font-bold">
        {space ? (
          <div>
            Edit Your
            <span style={{ color: "#2B5B93" }}> {space?.name} </span>
            Reservation
          </div>
        ) : (
          <Skeleton className="h-10 w-[900px] bg-[#E5E7EB] shadow-lg" />
        )}
      </h1>
      <div className="bg-white shadow-2xl relative flex justify-center items-center p-4 gap-14 pl-10 rounded-3xl max-w-7xl h-[613px]">
        {space ? (
          <div
            className="bg-gray-200 w-[512px] h-[478px] rounded-2xl shadow-2xl"
            style={{
              backgroundImage: `url(${space?.image})`,
              backgroundSize: "cover",
            }}
          />
        ) : (
          <Skeleton className="h-[478px] w-[512px] shadow-2xl bg-[#E5E7EB]" />
        )}

        <div>
          <div className="flex flex-col justify-between p-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {space ? (
                  <div className="flex gap-5">
                    <h1 className="text-4xl font-bold">{space?.name}</h1>
                    <div className="flex justify-center items-center">
                      <span className="bg-green-400 text-white rounded-lg px-3 max-w-max">
                        เปิดอยู่
                      </span>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-10 w-[450px] bg-[#E5E7EB] shadow-lg" />
                )}
              </div>
              {space ? (
                <div className="flex items-center gap-3">
                  <FaClock />
                  <p>
                    {dayjs(space?.openTime).format("HH:mm")} -{" "}
                    {dayjs(space?.closeTime).format("HH:mm")}
                  </p>
                </div>
              ) : (
                <Skeleton className="h-4 w-[450px] bg-[#E5E7EB] shadow-lg" />
              )}
              <hr />
              {space ? (
                <div className="max-w-lg">
                  <p>{space?.address}</p>
                  <p>{space?.tel}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-[400px] bg-[#E5E7EB] shadow-lg" />
                  <Skeleton className="h-4 w-[350px] bg-[#E5E7EB] shadow-lg" />
                  <Skeleton className="h-4 w-[250px] bg-[#E5E7EB] shadow-lg" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between px-10 gap-y-5">
            <div className="flex items-center gap-5 mb-3">
              <div className="text-[#736868] font-semibold text-base">Date</div>
              <div>
                {space ? (
                  <DatePicker
                    className="border-[#979797]"
                    onChange={handleDateChange}
                    defaultValue={dayjs(date)}
                    data-testid="spaceDatePicker"
                  />
                ) : (
                  <Skeleton className="h-[32px] w-[138px] bg-[#E5E7EB] shadow-lg" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <span>Reservation Quota: </span>
                <span
                  className={clsx(
                    "font-bold",
                    quota !== 0 ? "text-sky-500" : "text-gray-300"
                  )}
                >
                  {quota}
                </span>
                <HoverCard>
                  <HoverCardTrigger>
                    <CiCircleQuestion
                      className="text-gray-500"
                      size={16}
                      strokeWidth={0.75}
                    />
                  </HoverCardTrigger>

                  <HoverCardContent>
                    <h2 className="font-bold text-sky-500">
                      What's Reservation Quota?
                    </h2>
                    <p className="text-gray-500 font-sm">
                      You can make 3 reservations per day for co-working spaces.
                      Once you exceeded your quota you can find another free
                      days Hope you productive! 🌟
                    </p>
                    <hr className="my-3" />
                    <div className="flex-col w-full text-sm text-gray-800">
                      <div className="flex justify-between">
                        <span>Selected Date</span>
                        <span className="font-bold">
                          {date ? date.format("YYYY-MM-DD") : "Today"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining</span>
                        <span className="font-bold">
                          {quota !== null ? quota : "Loading"}
                        </span>
                      </div>
                    </div>

                    <span className="text-gray-400 text-xs">
                      Max Quota/Day: 3
                    </span>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
            <div className="flex items-center">
              <label className="mr-5 text-[#736868] font-semibold text-base">
                Time
              </label>
              <div className="col-span-3 flex gap-3">
                <div data-testid="spaceStartTime">
                  {space ? (
                    <TimeSelection
                      handleTimeChange={handleTimeChange}
                      disabledTime={disabledStartTime}
                      typeTime="start"
                      defultTime={dayjs(timeData?.startTime)}
                    />
                  ) : (
                    <Skeleton className="h-[32px] w-[150px] bg-[#E5E7EB] shadow-lg" />
                  )}
                </div>
                <div className="text-center self-center text-[#736868] font-semibold text-base">
                  To
                </div>
                <div data-testid="spaceEndTime">
                  {space ? (
                    <TimeSelection
                      handleTimeChange={handleTimeChange}
                      disabledTime={disabledEndTime}
                      defultTime={dayjs(timeData?.endTime)}
                      typeTime="end"
                    />
                  ) : (
                    <Skeleton className="h-[32px] w-[150px] bg-[#E5E7EB] shadow-lg" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="flex text-[#0043CE] font-bold text-base">
                Available Seat
              </div>

              {availableSeat ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-end">
                    <div className="font-bold text-base">{percent}%</div>
                    <div className="text-xs pb-[3px] text-[#6F6F6F]">
                      {availableSeat} seat left
                    </div>
                  </div>
                  <div>
                    <Progress className="h-3" value={percent} />
                  </div>
                </div>
              ) : dataPreFetch ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-end">
                    <div className="font-bold text-base">{DataPercent}%</div>
                    <div className="text-xs pb-[3px] text-[#6F6F6F]">
                      {dataPreFetch} seat left
                    </div>
                  </div>
                  <div>
                    <Progress className="h-3" value={DataPercent} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-[150px] bg-[#E5E7EB] shadow-lg" />
                  <Skeleton className="h-3 bg-[#E5E7EB] shadow-lg" />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleReserve}
                disabled={quota === 0}
                className={clsx(
                  "bg-black px-5 py-2 rounded-full text-white max-w-max",
                  quota === 0 && "bg-gray-300"
                )}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
