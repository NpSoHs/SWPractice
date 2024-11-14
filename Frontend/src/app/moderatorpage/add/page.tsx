import { TextField } from "@mui/material";
import { Input } from "@/components/ui/input";
import AddNewAdminForm from "@/components/moderator/addNewAdminForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default function addAdminPage() {
  return (
    <main>
      <div className="mt-4 mx-auto max-w-md">
        
        <AddNewAdminForm/>
      </div>
    </main>
  );
  }