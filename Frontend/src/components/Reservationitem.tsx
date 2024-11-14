"use client";
import { Reservation } from "../../interface";
import DeleteReservation from "@/libs/deleteReserve";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ReservationItem({
  reservation,
  datatestid
}: {
  reservation: Reservation;
  datatestid: string
}) {
  const session = useSession();
  const router = useRouter();

  const [hide, setHide] = useState("");

  const handleDelete = (e: any) => {
    e.preventDefault();
    const result = DeleteReservation(reservation._id, session.data!.user.token);

    setHide("hidden");
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    router.push(`/booking/edit/${reservation._id}`); // Navigate to the manage page with the reservation ID
  };

  const date = dayjs(reservation.startTime).format("DD MMMM YYYY");
  const startTime = dayjs(reservation.startTime)
    .tz("Asia/Bangkok")
    .format("HH:mm");
  const endTime = dayjs(reservation.endTime).tz("Asia/Bangkok").format("HH:mm");

  return (
    <div key={reservation._id} data-testid={datatestid} className={`border p-4 my-4 ${hide}`}>
      <h1 className="text-xl font-medium mb-2">{reservation.workingSpace?.name}</h1>
      <table className="border-separate border-spacing-x-3">
        <tbody>
          <tr>
            <td>Date</td>
            <td>{date}</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>
              {startTime} - {endTime}
            </td>
          </tr>
          <tr>
            <td>User</td>
            <td className="tracking-wide">{reservation.user.email}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
