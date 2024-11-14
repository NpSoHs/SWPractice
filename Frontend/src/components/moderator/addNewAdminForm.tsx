"use client";
import { TextField } from "@mui/material";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import createAdmin from "@/libs/createAdmin";
import { useRouter } from "next/navigation";
import { User } from "../../../interface";
import updateAdmin from "@/libs/updateAdmin";

export default function addNewAdminForm(){
  const session = useSession();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter()
  const handlerSave = async (e: any) => {
    try {
      e.preventDefault();
      const admin = await updateAdmin(
        session.data!.user._id,
        name,
        email,
        tel,
        role,
        session.data!.user.token
      );
      router.push('/moderatorpage')
    } catch (error) {
      console.log("Error for post" + error);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <form
        action=""
        className="flex flex-col justify-between p-5 bg-white w-[1042px] h-[588px] rounded-2xl shadow-2xl"
        onSubmit={handlerSave}
      >
        <div className="text-center text-xl font-semibold text-gray-600 mt-3">
          Add New Admin
        </div>

        <div className="flex items-center">
          <label className="w-32">ชื่อ:</label>
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
          <label className="w-32">เบอร์โทร:</label>
          <Input
            type="text"
            placeholder="tel"
            className="col-span-3"
            maxLength={10}
            id="admin_tel"
            onChange={(e) => {
              console.log(e.target.value);
              setTel(e.target.value);
            }}
            value={tel}
          />
        </div>

        <div className="flex items-center">
          <label className="w-32">อีเมล:</label>
          <Input
            type="text"
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
          <select
            name="Role"
            id="role"
            className="col-span-3"
            onChange={(e) => {
              console.log(e.target.value);
              setRole(e.target.value);
            }}
          >
            {" "}
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
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
 