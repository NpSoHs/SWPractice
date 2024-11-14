"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import getAllAdmins from "@/libs/getallAdmins";
import AdminItem from "@/components/moderator/AdminItem";
import { User } from "../../../interface";
import AddButtonAdmin from "@/components/moderator/AddButtonAdmin";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import getAllUser from "@/libs/getUsers";

interface Props {
  params: { id: string };
}
type SortOrder = {
  [key: string]: number;
};

export default function ModeratorPage() {
  const session = useSession();
  if (!session) return null;
  // const allUsers_obeject = await getAllAdmins(session.user.token);
  // const usersdata = allUsers_obeject.data;
  const [users, setusers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAllAdmins((session as any).data?.user.token);
      if (!userData) {
        console.error("Invalid user data: ", userData);
        return;
      }
      setusers(userData.data);
    };
    fetchData();
  });
  const [search, setSearch] = useState("");
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  return (
    <div className="p-4">
      {" "}
      {/* Add padding for spacing */}
      <div className="text-2xl font-bold mb-4">Manage Account</div>
      {/* Search box and Add button */}
      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearch}
        />
        {/* <AddButtonAdmin/> */}
      </Stack>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Create Date
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users
              .filter((item: User) => {
                return (
                  item.name.toLowerCase().includes(search.toLowerCase()) ||
                  item.role.toLowerCase().includes(search.toLowerCase()) ||
                  item.email.toLowerCase().includes(search.toLowerCase())
                );
              })
              .sort((a: User, b: User) => b.role.localeCompare(a.role))
              .map((eachadmin: User) => (
                <AdminItem admin={eachadmin} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
