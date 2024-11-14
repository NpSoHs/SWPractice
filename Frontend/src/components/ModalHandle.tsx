"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SpaceItem } from "../../interface";

export default function ModalHandle({
  space,
  context,
}: {
  space: SpaceItem;
  context?: string;
}) {
  const [open, setOpen] = useState(false);
  const [remain, setRemain] = useState(space.maxSeat);

  const router = useRouter();
  const session = useSession();

  return (
    <div className="flex gap-2 items-center mt-5">
      {remain! > 0 ? (
        <button
          className="bg-black px-5 py-2 rounded-full text-white max-w-max "
          onClick={() => {

            if (!session.data) {
              router.push("/api/auth/signin");
            } else {
              setOpen(true);
            }
          }}
        >
          {context}
        </button>
      ) : (
        <p className="bg-gray-400 px-5 py-2 rounded-full text-white max-w-max ">
          เต็มแล้ว
        </p>
      )}
      <p>ที่ว่าง: {remain}</p>

      <Modal
        isOpen={open}
        data={space}
        handleClose={() => setOpen(false)}
        decreaseRemain={() => setRemain(remain! - 1)}
      />
    </div>
  );
}
