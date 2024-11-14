import { TextField } from "@mui/material";
import { Input } from "@/components/ui/input";
import EditAdminForm from "@/components/moderator/editAdminForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getAllAdmins from "@/libs/getallAdmins";

interface Props {
  params: { id: string };
}

export default async function managePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;
  const allUsers_obeject = await getAllAdmins(session.user.token);
  const usersdata = allUsers_obeject.data.filter((i:any)=>i._id==params.id);
  return (
    <main>
      <div className="mt-4 mx-auto max-w-md">
        <EditAdminForm adminID={params.id} adminData={usersdata}></EditAdminForm>
      </div>
    </main>
  );
}
