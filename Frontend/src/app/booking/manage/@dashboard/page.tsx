import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getUserProfile from "@/libs/getUserProfile";
import Space from "@/db/models/WorkingSpace";
import { dbConnect } from "@/db/dbConnect";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

export default async function DashboardPage() {

    const addSpace = async (addWorkingSpaceForm:FormData)=>{
        'use server'
        const model = addWorkingSpaceForm.get("model")
        const address = addWorkingSpaceForm.get("address")
        const picture = addWorkingSpaceForm.get("picture")
        const tel = addWorkingSpaceForm.get("tel")
        const openTime = addWorkingSpaceForm.get("openTime")
        const closeTime = addWorkingSpaceForm.get("closeTime")

        try{
            await dbConnect()
            const space = await Space.create({
                "model":model,
                "address":address,
                "picture":picture,
                "tel":tel,
                "openTime":openTime,
                "closeTime":closeTime
            })
        }catch(error){
            console.log(error)
        }
        revalidateTag("co-working spaces")
        redirect("/space")
    }

  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;

  const profile = await getUserProfile(session.user.token);
  var createdAt = new Date(profile.data.createdAt);

  return (
    <main className="bg-slate-100 m-5 p-5">
      <div className="text-2xl"> {profile.data.name}</div>
      <table className="table-auto border-separate border-spacing-2">
        <tbody>
          <tr>
            <td> Email </td>
            <td className="tracking-wide"> {profile.data.email} </td>
          </tr>
          <tr>
            <td> Tel. </td>
            <td> {profile.data.tel} </td>
          </tr>
          <tr>
            <td> Role </td>
            <td> {profile.data.role} </td>
          </tr>
          <tr>
            <td> Member Since </td>
            <td> {dayjs(createdAt).format('DD MMMM YYYY')} </td>
          </tr>
          
        </tbody>
      </table>
    </main>
  ); 
}
