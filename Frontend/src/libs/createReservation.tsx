import Swal from "sweetalert2";
import { Reservation } from "../../interface";
export default async function createReservation(
  data: Reservation,
  token: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/workingspace/${data.workingSpace}/reservation/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const ans = await response.json();

    Swal.fire({
      title: "Error!",
      text: ans.message || "Create Failed",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Create successfully",
      icon: "success",
    });
    return await response.json();
  }
}