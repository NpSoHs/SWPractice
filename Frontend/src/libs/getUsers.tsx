export default async function getAllUser(token: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/allusers`,
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
  