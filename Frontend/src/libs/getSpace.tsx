export default async function getSpace(id: String) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/workingspace/` + id
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch space");
    }
  
    return await response.json();
  }
  