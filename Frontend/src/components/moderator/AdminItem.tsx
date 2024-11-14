"use client";

import * as React from "react";
import getAllAdmins from "@/libs/getallAdmins";
import { User } from "../../../interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteUser from "@/libs/deleteUser";
import dayjs from "dayjs";
type AdminItemProp = {
    admin: User
}
export default function AdminItem({admin}: AdminItemProp) {
    const session = useSession();
    const router = useRouter();
    const [hide, setHide] = useState("");
    const handleDelete = (e: any) => {
        e.preventDefault();
        const result = DeleteUser(admin._id, session.data!.user.token);
    
        setHide("hidden")
      };
    
      const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        router.push(`/moderatorpage/edit/${admin._id}`); // Navigate to the manage page with the reservation ID
      };
    
  return (
    <>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">
              {admin.name}
            </div>
            <div className="text-xs text-gray-500">{admin.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap"> {dayjs(admin.createdAt).format('DD MMMM YYYY')}</td>
          <td className="px-6 py-4 whitespace-nowrap">{admin.role}</td>
          <td className="px-6 py-4">
            <button className="text-blue-600 hover:underline mr-2" onClick={handleEdit}>Edit</button>
            <button className="text-red-600 hover:underline" onClick={handleDelete}>Delete</button>
          </td>
        </tr>
    </>
  );
}
