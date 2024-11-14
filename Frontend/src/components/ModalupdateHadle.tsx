"use client";
import React, { useState } from "react";
import Modalupdate from "./Modalupdate";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SpaceItem } from "../../interface";

export default function ModalupdateHandle({
  space,
  context,
  id,
}: {
  space: SpaceItem;
  context?: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  return (
    <div>
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

      <Modalupdate
        isOpen={open}
        data={space}
        handleClose={() => setOpen(false)}
        id={id}
      />
    </div>
  );
}
