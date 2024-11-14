import Swal from "sweetalert2";

export default async function unbanUser(id: string, token: string, isSubmitBan:Function) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/unban`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: id,
      }),
    }
  );

  if (!response.ok) {
    const ans = await response.json();

    Swal.fire({
      title: "Error!",
      text: ans.message || "Unban Failed",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Unbanned successfully",
      icon: "success",
    });
    isSubmitBan();
    return await response.json();
  }
}
