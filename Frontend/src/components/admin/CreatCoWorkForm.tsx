"use client";
import React, { FormEvent, useState } from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../ui/input";
import { useCardContext } from "@/context/CardContext";
import createCoWorkingSpace from "@/libs/createWorkingSpace";
import { SetPreviewCard } from "../../../interface";
import { useSession } from "next-auth/react";
import updateWorkingSpace from "@/libs/updateWorkingSpace";
import Swal from "sweetalert2";

interface Props {
  data?: any;
}

export default function CoWorkForm({ data }: Props) {
  const format = "HH:mm";
  const {
    handleFormChange,
    handleOpenChange,
    handleCloseChange,
    amount,
    inputValue,
    isValid,
    card,
  } = useCardContext();
  const session = useSession();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(dayjs(card.openTime).isAfter(card.closeTime) || dayjs(card.openTime).isSame(card.closeTime)){
      Swal.fire({
        title: "Error!",
        text: "Invalid close time",
        icon: "error",
      });
      return;
    }
    createCoWorkingSpace(
      {
        name: card.name,
        address: card.address,
        openTime: card.openTime,
        closeTime: card.closeTime,
        maxSeat: card.maxSeat,
        image: card.image,
      },
      session.data!.user.token
    );
  };

  return (
    <div className=" bg-white rounded-2xl shadow-2xl">
      {/* {card.name}
      {card.address}
      {card.openTime}
      {card.closeTime}
      {card.maxSeat}
      {card.image} */}
      <form onSubmit={onSubmit} className="p-20 grid grid-cols-4 gap-10 ">
        <label htmlFor="image-upload">Image:</label>
        {/* <Input
            type="file"
            className="col-span-1 max-w-60 text-gray-400"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          /> */}
        <Input
          required
          type="text"
          className="col-span-2 text-xs max-w-60 text-gray-400"
          placeholder="Image Url"
          id="image"
          onChange={handleFormChange}
          defaultValue={data?.image}
        />
        <div className="col-span-1"></div>

        {/* <label className="cursor-pointer col-span-3">
          <input type="file" className="hidden" />
          <span className=" text-sm underline text-[#9CA3AF] hover:underline-offset-2 bg-[#E1E7EA] px-6 py-1 rounded-lg top-0">
            Upload File
          </span>
        </label> */}
        <label>Name:</label>
        <Input
          required
          type="text"
          placeholder="co-working space's name"
          className="col-span-3 "
          onChange={handleFormChange}
          maxLength={25}
          id="name"
          defaultValue={data?.name}
        />
        <label>Open Time:</label>
        <div className="col-span-3 flex gap-3">
          <TimePicker
            required
            format={format}
            className=" "
            id="openTime"
            data-testid="openTime"
            onChange={handleOpenChange}
            minuteStep={30}
            /* defaultValue={dayjs(data?.openTime, 'HH:mm')} */
          />
          <div className="text-center self-center">to</div>
          <TimePicker
            required
            format={format}
            className=" "
            id="closeTime"
            data-testid="closeTime"
            onChange={handleCloseChange}
            minuteStep={30}
            /* defaultValue={dayjs(data?.closeTime, 'HH:mm')} */
          />
        </div>
        <label>Description:</label>
        <Textarea
          required
          className="col-span-3 "
          placeholder="co-working space's detail"
          onChange={handleFormChange}
          maxLength={120}
          id="address"
          defaultValue={data?.address}
        />
        <label>Seat:</label>
        <div className="flex flex-col">
          <Input
            required
            type="number"
            placeholder="Max seats"
            className=" rounded-lg p-3"
            /* value={inputValue} */
            onChange={handleFormChange}
            id="maxSeat"
            defaultValue={1}
            min={1}
            max={5000}
          />
          <div className="text-xs text-red-500 flex ml-3 mt-3">
            {isValid ? (
              <div className="mt-4"></div>
            ) : (
              "You cant use the negative number"
            )}
          </div>
        </div>

        <div className="col-span-2"></div>
        <div className="col-span-3"></div>
        <Input
          type="submit"
          className="cursor-pointer flex justify-center rounded-full text-md w-36 transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
        />
      </form>
    </div>
  );
}
