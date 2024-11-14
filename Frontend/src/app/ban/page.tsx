"use client";
import ModalBanHandle from "@/components/ban/ModalBanHandler";
import getAllUser from "@/libs/getUsers";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Ban() {
  const session = useSession();
  if (!session) return null;
  const [users, setUsers] = useState([]);
  const [checkBan, setCheckBan] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAllUser((session as any).data?.user.token);
      if (!userData) {
        console.error("Invalid user data:", userData);
        return;
      }
      setUsers(userData.data);
    };

    fetchData();
  }, [checkBan]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold">List of users</h1>

      <input
        type="text"
        className="bg-[#E1E7EA] rounded-lg py-2 px-4 w-80 mt-3 mb-10"
        placeholder="Search"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      <div className="flex flex-col bg-white p-4 rounded-2xl">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light text">
                <thead className="border-b border-neutral-200 font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>{" "}
                    <th scope="col" className="px-6 py-4">
                      Tel
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Ban Until
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((item: any) => {
                      return (
                        item.role == "user" &&
                        (item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.email.toLowerCase().includes(search.toLowerCase()))
                      );
                    })
                    .map((item: any) => (
                      <tr key={item.id} className="border-b border-neutral-200">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.tel}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.banUntil? dayjs(item.banUntil).format("DD MMMM YYYY") : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <ModalBanHandle
                            data={item}
                            isSubmitBan={() => {
                              setCheckBan(!checkBan);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
