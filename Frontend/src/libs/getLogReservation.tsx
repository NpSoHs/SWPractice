export default async function getLogReservation(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/log/reservation`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
}
