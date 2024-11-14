import Swal from "sweetalert2";
import { Reservation } from "../../interface";
export default async function UpdateReservation(
  id: string,
  token: string,
  date: Reservation
) {
  const body = JSON.stringify({
    startTime: date.startTime,
    endTime: date.endTime,
  }); // Construct the request body

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/reservation/` + id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body, // Include the request body
    }
  );
  if (!response.ok) {
    const ans = await response.json();

    Swal.fire({
      title: "Error!",
      text: ans.message || "Cannot Update #" + id,
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Update successfully",
      icon: "success",
    });

    return await response.json();
  }
}
