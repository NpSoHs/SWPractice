import Swal from "sweetalert2";

export default async function updateAdmin(
  id: string,
  name: string,
  email: string,
  tel: string,
  role: string,
  token: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/edit/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          tel: tel,
          role: role,
        }),
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
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: (error as any).message || "Cannot Update #" + id,
      icon: "error",
    });
  }
}
