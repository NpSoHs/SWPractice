import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getUserProfile from "@/libs/getUserProfile";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useEffect } from "react";
import Marquee from "react-fast-marquee";

export default function Banner() {
  let isAdmin: boolean | null = null;
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getServerSession(authOptions);
        if (session) {
          const profile = await getUserProfile(session?.user.token);
          const role = profile.data.role;
          isAdmin = role === "admin" ? true : false;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSession();
  }),
    [];

  const imgList = [
    "https://www.brandbuffet.in.th/wp-content/uploads/2019/08/Samyan-COOP-1.jpg",
    "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/c8c10f6c3a4c4a969c9b6c967fe6b8f8~tplv-tej9nj120t-origin.webp",
    "https://assets.brandinside.asia/uploads/2022/07/KLOUD-27.jpeg",
    "https://morphosis-staging.s3.ap-southeast-1.amazonaws.com/wpuploads/2022-front-co-working-inside.jpg",
    "https://img.wongnai.com/p/1920x0/2018/08/27/851c40685e014dc591da65384e66b5b4.jpg",
    "https://www.terrabkk.com/images/upload/af178899ca2cc98fcf8a7114450d17a7.jpg",
  ];

  return (
    <div className="pt-[130px] pb-40">
      <div className="flex flex-col justify-center gap-7 w-full">
        <span className="px-4 py-2 bg-blue-100 mx-auto max-w-max rounded-full text-blue-600">
          {isAdmin
            ? "Elevate this site towards success"
            : "Join us for productive vibes!"}
        </span>{" "}
        <h1 className="max-w-5xl text-8xl font-extrabold text-center mx-auto">
          <span className="bg-gradient-to-b from-blue-700 to-blue-400 bg-clip-text text-transparent">
            Co-working{" "}
          </span>
          {isAdmin ? "Space Manage System " : "Space Reservation"}
        </h1>
        <p className="max-w-xl text-center mx-auto">
          Discover seamless co-working bookings. Reserve your space
          effortlessly.
        </p>
        {isAdmin ? (
          <Link
            href="/adminpage"
            className="bg-black max-w-max text-white px-6 py-3 mx-auto rounded-full"
          >
            แก้ไข
          </Link>
        ) : (
          <Link
            href="#booking"
            className="bg-black max-w-max text-white px-6 py-3 mx-auto rounded-full"
          >
            reserve now
          </Link>
        )}
        <Marquee speed={50} className="py-10">
          {imgList.map((item) => (
            <div
              className="bg-blue-600 rounded-[40px] h-96 w-80 mx-5 "
              style={{
                backgroundImage: `url(${item})`,
                backgroundSize: "cover",
              }}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
