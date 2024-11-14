export default async function getUserProfile(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/me`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );


  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message);
  }

  
  return result
}
