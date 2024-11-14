import Swal from "sweetalert2";
export default async function createCoWorkingSpace(
  data: object,
  token: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/workingspace`,
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
    console.log(ans.message);
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
  /* .then((response) => {
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Create successfully",
          icon: "success",
        });
        return response.json();
      }
      return response.json().then((error) => {
        throw new Error(error);
      });
    })
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: "Cannot create new co-working space",
        icon: "error",
      });
    }); */
}
