"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState(false);

  const handlerSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!email) {
        setError("Please Enter your Email"); 
        return;
      }
      if (!password) {
        setError("Please Enter your Password");
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(res);
      if (res?.error) {
        setError(res.error);
        console.log(res.error);
        return;
      }
      router.refresh();
      router.replace("/");
    } catch (error) {
      console.log("Error from login" + error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden ">
      <div className="bg-white bg-opacity-75 flex flex-col justify-center w-[569px] h-[643px] px-0 py-0 lg:px-8 rounded-3xl overflow-hidden">
        <div className="  sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="tracking-wider mt-10 text-center text-2xl font-extrabold leading-9  text-gray-900">
            Sign-In to your account
          </h2>
        </div>

        <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handlerSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 hover:bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign-In
              </button>
            </div>
            {error && (
              <div className=" text-center bg-rose-700 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?
            <Link href="/register" className="ml-2 font-semibold leading-6 text-green-600 hover:text-green-700 m-1">
              Sign-Up
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default LoginPage;

