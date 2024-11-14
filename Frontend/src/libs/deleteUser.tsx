import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default async function DeleteUser(id: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/deleleuser/` +
      id,
    {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const ans = await response.json();
    Swal.fire({
      title: "Error!",
      text: ans.message || "Delete Failed",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Deleted successfully",
      icon: "success",
    });

    return await response.json();
  }
}
