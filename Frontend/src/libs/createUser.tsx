import Swal from "sweetalert2";

export default async function registerUser(data: Object) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const ans = await response.json();

    Swal.fire({
      title: "Error!",
      text: ans.message || "Register Failed",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Success!",
      text: "Register successfully",
      icon: "success",
    });
    return await response.json();
  }
}
