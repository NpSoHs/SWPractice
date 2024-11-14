export default async function getReservation(id: String,token:string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
   `${process.env.NEXT_PUBLIC_BACKEND_URI}/reservation/` +
      id,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch space");
  }

  return await response.json();
}
