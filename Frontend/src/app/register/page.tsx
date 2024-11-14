"use client";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import registerUser from "@/libs/createUser";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();


  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setError("")

      if (!email || !password || !name || !tel) {
        setError("Please enter complete information.");
        
        return;
      }

      if (password.length < 6) {
        setError("Password must have at least 6 characters.");
        
        return;
      }

      const telRegex = /^\d+$/;
      if (tel.length !== 10) {
        setError("Please enter a valid phone number with 10 digits.");
        
        return;
      }
      if (!telRegex.test(tel)) {
        setError("Please enter a only digits");
        
        return;
      }

      const user = await registerUser({
        name: name,
        tel: tel,
        email: email,
        password: password,
      });
      console.log({ user });
      if (!user) {
        setError("Register Error");
        
        return;
      }

      if (user.success === false) {
        setError("This email is already use.");
        
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        
        return;
      }

      console.log("going to router");
      router.refresh();
      router.replace("/");
    } catch (error) {
      console.log("Error from login" + error);
      
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-white bg-opacity-75 flex flex-col justify-center w-[569px] h-[750px] px-0 py-0 lg:px-8 rounded-3xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
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
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="tel"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tel
              </label>
              <div className="mt-2">
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  required
                  onChange={(e) => setTel(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 hover:bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign-Up
              </button>
            </div>
            {error && (
              <div className=" text-center bg-red-700 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-sm text-black">
            Already have an account?
            <Link href="/login" className="font-semibold leading-6 text-green-600 hover:text-green-700 m-1">
              Sign-In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
