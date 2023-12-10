"use client"

import { Ledger } from "@/components/Ledger";
//import { Payload } from "@/components/Payload";
import { Xaman } from "@/components/Xaman";
import { Janken } from "@/components/Janken";
//import { Multisigh } from "@/components/Multisigh";

export default function App() {
  return (
    <>
      <div className='p-8 py-16 text-center container mx-auto'>
        <div className="p-4 m-4 card border border-primary">
          <Ledger />
          <Xaman />
          <Janken />
        </div>
      </div>
    </>
  )
}