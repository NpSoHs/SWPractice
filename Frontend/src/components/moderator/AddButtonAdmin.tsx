'use client'
import { useRouter } from 'next/navigation';
import React from 'react'


export default function AddButtonAdmin() {
    const router = useRouter();
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={(e)=>{router.push(`/moderatorpage/add`);}}>
          +Add
        </button>
  )
}
