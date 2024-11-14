import Swal from "sweetalert2";

export default async function banUser(
  id: string,
  banUntil: string,
  banReason: string,
  token: string,
  isSubmitBan: Function
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/ban`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: id,
        banUntil: banUntil,
        banReason: banReason,
      }),
    }
  );

  if (!response.ok) {
    const ans = await response.json();

    Swal.fire({
      title: "Error!",
      text: ans.message || "Ban Failed",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Banned successfully",
      icon: "success",
    });
    isSubmitBan();
    return await response.json();
  }
}
