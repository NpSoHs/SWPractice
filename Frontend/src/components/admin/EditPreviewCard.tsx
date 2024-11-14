"use client";
import React from "react";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { AiFillClockCircle } from "react-icons/ai";
import { SpaceItem, Time } from "../../../interface";
import { SetPreviewCard } from "../../../interface";
import { useCardContext } from "@/context/CardContext";
import dayjs from "dayjs";
export default function Test({ data }: { data?: SpaceItem }) {
  const { cardEdit } = useCardContext();

  const descc =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga obcaecati nemo veniam minus, omnis, nam, labore sint ab dolor quisquam ipsa possimus. Itaque reprehenderit temporibus animi minima repellendus distinctio similique.";
  return (
    <div className="h-[520px] relative flex flex-col text-gray-700 bg-white shadow-xl bg-clip-border rounded-xl w-96 p-3">
      {cardEdit?.image ? (
        <div className="relative h-[180px] mx-4 mt-4 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img src={cardEdit?.image} alt="card-image" />
        </div>
      ) : data?.image ? (
        <div className="relative h-[180px] mx-4 mt-4 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
          <img src={data?.image} alt="card-image" />
        </div>
      ) : (
        <div className="h-48 flex justify-center items-center shadow-lg bg-slate-200 bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40 overflow-hidden">
          <MdOutlinePhotoLibrary size={80} color="slate" />
        </div>
      )}

      <div className="p-4">
        <div></div>
        <h5 className="block text-xl antialiased font-semibold leading-snug tracking-normal text-black mt-1">
          {cardEdit?.name ? cardEdit?.name : data?.name}
        </h5>
        <div className="flex gap-2">
          <AiFillClockCircle className="mb-2" color="black" size={20} />
          <div>
            {cardEdit?.openTime || cardEdit?.closeTime ? (
              <div>
                {" "}
                {`${dayjs(cardEdit?.openTime).format("HH:mm")} - ${dayjs(cardEdit?.closeTime).format("HH:mm")}`}{" "}
              </div>
            ) : (
              <div>
                {`${dayjs(data?.openTime).format("HH:mm")} - ${dayjs(data?.closeTime).format("HH:mm")}`}
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className=" mt-2 text-lg font-medium text-black">Description</div>
        <div className=" break-words h-24 text-base antialiased font-light leading-relaxed text-inherit">
          {cardEdit?.address ? cardEdit?.address : data?.address}
        </div>
      </div>

      <div className="px-4">
        <div className="mt-2 flex gap-3 ">
          <div>Seat :</div>
          <div>{cardEdit?.maxSeat ? cardEdit?.maxSeat : data?.maxSeat}</div>
        </div>
      </div>

      <div className=" flex justify-end ">
        <button className="align-middle select-none text-base font-normal text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-1 px-7 rounded-full bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none">
          Edit
        </button>
      </div>
    </div>
  );
}
