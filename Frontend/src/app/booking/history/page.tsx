import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import ReservationLogItem from "@/components/reservationHistory/reseravtionLogItem";
import getLogReservation from "@/libs/getLogReservation";
import { LogEditReservation } from "../../../../interface";
export default async function historyPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;
  const logEdit = await getLogReservation(session.user.token);
  const logeditData = logEdit.data;
  return (
    <>
      <div className="">
        <div className="text-3xl ">Reservation History</div>
        {logeditData.length == 0 && (
          <h2 className="text-2xl">You haven't edit any reservation yet.</h2>
        )}
        {logeditData.map((logedit: LogEditReservation) => (
          <ReservationLogItem logEdit={logedit} datatestid="reservationLog" />
        ))}
      </div>
    </>
  );
}
