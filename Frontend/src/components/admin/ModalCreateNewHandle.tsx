"use client";
import React from "react";
import { useState } from "react";
import ModalCreateNew from "./ModalCreateNew";

export default function ModalCreateNewHandle() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="bg-black hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-full"
      >
        สร้างใหม่
      </button>

      <ModalCreateNew isOpen={isOpen} handleClick={() => setIsOpen(false)} />
    </div>
  );
}
