"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import { useSession } from "next-auth/react";
import Reserve from "@/libs/confirmReserve";
import { SpaceItem } from "../../interface";
import DateReserve from "./DateReserve";
interface Props {
  isOpen: boolean;
  handleClose: any;
  data: SpaceItem;
  decreaseRemain:any
}

export default function Modal({ isOpen, handleClose, data,decreaseRemain }: Props) {
  const session = useSession();
  const [date, setDate] = useState<any>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const result = Reserve(
      data._id!,
      session.data!.user.token,
      date!.$d as string
    );
    console.log(result);

    decreaseRemain()
    handleClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 mt-14 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <a
                  className="fixed right-7 top-7 z-10 cursor-pointer rounded-full bg-white p-2 text-2xl text-gray-800 shadow-lg "
                  onClick={handleClose}
                >
                  <RxCross1 />
                </a>
                <div className="px-5 pt-8 pb-3 ">
                  <h1 className="font-bold text-4xl">ยืนยันการจอง</h1>
                  <hr className="my-3" />
                  <p>{data.name}</p>
                  <p>{data.address}</p>
                  <p>{data.tel}</p>
                  <p className="mt-5">กรุณาระบุวันที่</p>
                  <div className="flex gap-5 items-center">
                    <DateReserve date={(value: any) => setDate(value)} />
                    {date ? (
                      <button
                        className="bg-black px-5 py-2 rounded-full text-white max-w-max "
                        onClick={handleSubmit}
                        
                      >
                        ตกลง
                      </button>
                    ) : (
                      <button
                        className="bg-gray-300 px-5 py-2 rounded-full text-white max-w-max "
                        disabled
                      >
                        ตกลง
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
