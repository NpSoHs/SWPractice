export default async function checkAvailableSeat(id: String, data?: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/workingspace/available/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch space");
  }

  return await response.json();
}
