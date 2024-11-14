import Swal from "sweetalert2";

export default async function userLogIn(
  username: string,
  userPassword: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: userPassword,
      }),
    }
  );

  if (!response.ok) {
    const ans = await response.json();
    throw new Error(ans.msg || "Failed to Login");
  }
  
  const profileData = await response.json();
  return profileData;
}
