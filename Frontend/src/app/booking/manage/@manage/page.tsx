import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import getAllReservation from "@/libs/getallReserve";
import { Reservation } from "../../../../../interface";
import ReservationItem from "@/components/Reservationitem";
import Link from "next/link";
export default async function managePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;
  const reservations = await getAllReservation(session.user.token);
  const reservationData = reservations.data;
  return (
    <main>
      <div className="p-10">
        <div className="flex justify-between items-center">
          <div className="text-3xl ">All Reservation</div>
          <Link
            href={"/booking/history"}
            className="py-2 px-5 flex items-center justify-center bg-slate-300 text-base font-medium rounded-[10px] duration-200 hover:bg-slate-400"
          >
            Your History
          </Link>
        </div>
        {reservationData.length == 0 && (
          <h2 className="text-xl">
            You haven't made any reservation yet.{" "}
            <Link href="/#booking" className="text-sky-500 underline">
              Book here
            </Link>
          </h2>
        )}
        {reservationData.map((reservation: Reservation) => (
          <ReservationItem
            reservation={reservation}
            datatestid={"reservationtest"}
          />
        ))}
      </div>
    </main>
  );
}
