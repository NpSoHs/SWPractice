"use client";
import { LogEditReservation, Reservation } from "../../../interface";
import DeleteReservation from "@/libs/deleteReserve";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { cn } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ReservationLogItem({
  logEdit,
  datatestid
}: {
  logEdit: LogEditReservation;
  datatestid:string
}) {
  const { data: session } = useSession();

  const datebefore = dayjs(logEdit.beforeEditStartTime).format("DD MMMM YYYY");
  const dateafter = dayjs(logEdit.afterEditStartTime).format("DD MMMM YYYY");
  const startTimeafter = dayjs(logEdit.afterEditStartTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const endTimeafter = dayjs(logEdit.afterEditEndTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const startTimebefore = dayjs(logEdit.beforeEditStartTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const endTimebefore = dayjs(logEdit.beforeEditEndTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const reservationDate = dayjs(logEdit.reservationOrigin.startTime).format(
    "DD MMMM YYYY"
  );
  const reservationTimeStart = dayjs(logEdit.reservationOrigin.startTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const reservationTimeEnd = dayjs(logEdit.reservationOrigin.endTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");

  if (!session) return null;
  let actionColor = "";
  let actionText = "";
  if (logEdit.action == "forceCancel") {
    actionText = "Forced Cancel by Admin";
    actionColor = "bg-rose-600";
  } else if (logEdit.action == "cancel") {
    actionText = "Canceled";
    actionColor = "bg-rose-600";
  } else if (logEdit.action == "edit") {
    actionText = "Edited";
    actionColor = "bg-blue-600";
  }

  return (
    <div key={logEdit._id} data-testid={datatestid} className={`border p-4 my-4 `}>
      <p className="text-xl font-medium mb-2 inline mr-3">
        {logEdit.reservationOrigin
          ? logEdit.reservationOrigin.workingSpace.name
          : "canceled reservation"}
      </p>
      <span className={cn("text-white rounded-lg px-3 max-w-max", actionColor)}>
        {actionText}
      </span>
      <table className="border-separate border-spacing-x-3">
        <tbody>
          <tr>
            <td>Date</td>
            {logEdit.action == "edit" && (
              <td>
                <span className="line-through text-gray-400">{datebefore}</span>{" "}
                {dateafter}
              </td>
            )}

            {(logEdit.action == "cancel" ||
              logEdit.action == "forceCancel") && (
              <td>
                <span>{reservationDate} </span>
              </td>
            )}
          </tr>
          <tr>
            <td>Time</td>
            {logEdit.action == "edit" && (
              <td>
                <span className="line-through text-gray-400">
                  {startTimebefore} - {endTimebefore}
                </span>{" "}
                to {startTimeafter} - {endTimeafter}
              </td>
            )}

            {(logEdit.action == "cancel" ||
              logEdit.action == "forceCancel") && (
                <td>
                  {reservationTimeStart} - {reservationTimeEnd}
                </td>
              )}
          </tr>
          {session.user.role == "admin" ||
            (session.user.role == "moderator" && (
              <tr>
                <td>User</td>
                <td className="tracking-wide">
                  {logEdit.reservationOrigin.user.name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
