export default async function getAllAdmins(token:string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/allroles`,
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