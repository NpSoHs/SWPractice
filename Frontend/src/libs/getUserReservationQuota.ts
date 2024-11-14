import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
export default async function getUserReservationQuota(
  token: string,
  date?: string
) {
  if (!date) {
    date = dayjs().tz("Asia/Bangkok").toString();
  }
  const requestBody = date ? { selectedDate: date } : {};

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/reservation/quota`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user quota");
  }

  return await response.json();
}
