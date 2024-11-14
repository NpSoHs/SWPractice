"use client";
import { TextField } from "@mui/material";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import updateAdmin from "@/libs/updateAdmin";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";

export default function EditAdminForm({
  adminID,
  adminData,
}: {
  adminID: string;
  adminData: any;
}) {
  const [name, setName] = useState(adminData[0].name);
  const [tel, setTel] = useState(adminData[0].tel);
  const [email, setEmail] = useState(adminData[0].email);
  const [role, setRole] = useState(adminData[0].role);
  const session = useSession();
  const router = useRouter();
  const handlerSave = async (e: any) => {
    try {
      e.preventDefault();
      const admin = await updateAdmin(
        adminID,
        name,
        email,
        tel,
        role,
        session.data!.user.token
      );
      router.push("/moderatorpage");
      router.refresh();
    } catch (error) {
      console.log("Error for update" + error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        action=""
        className="flex flex-col justify-between p-5 bg-white w-[1042px] h-[588px] rounded-2xl shadow-2xl"
        onSubmit={handlerSave}
      >
        <div className="text-center text-xl font-semibold text-gray-600 mt-3">
          Edit Admin
        </div>

        <div className="flex items-center">
          <label className="w-32">Name:</label>
          <Input
            type="text"
            placeholder="name"
            className="col-span-3"
            maxLength={25}
            id="admin_name"
            onChange={(e) => {
              console.log(e.target.value);
              setName(e.target.value);
            }}
            value={name}
          />
        </div>

        <div className="flex items-center">
          <label className="w-32">Tel:</label>
          <Input
            type="tel"
            placeholder="tel"
            className="col-span-3"
            maxLength={10}
            pattern="[0-9]{10}"
            id="admin_tel"
            onChange={(e) => {
              console.log(e.target.value);
              setTel(e.target.value);
            }}
            value={tel}
          />
        </div>

        <div className="flex items-center">
          <label className="w-32">Email:</label>
          <Input
            type="email"
            placeholder="email"
            className="col-span-3"
            maxLength={25}
            id="admin_email"
            onChange={(e) => {
              console.log(e.target.value);
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>

        <div className="flex items-center">
          <label className="w-32">Role:</label>
          <Select
            name="Role"
            onValueChange={(s) => setRole(s)}
            defaultValue={role}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user" className="bg-white">User</SelectItem>
              <SelectItem value="admin" className="bg-white">Admin</SelectItem>
              <SelectItem value="moderator" className="bg-white">Moderator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="rounded-md bg-sky-600 hover:bg-green-600 px-3 py-2
                shadow-sm text-white w-[247px] h-[55px]"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
