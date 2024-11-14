export default async function getSpaces() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/workingspace`, {
    next: { tags: ["co-working spaces"] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spaces");
  }

  return await response.json();
}
