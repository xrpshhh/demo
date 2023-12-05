"use client"

import { useEffect, useState } from "react";
import { Client } from "xrpl";

const ws = process.env.WS_URI

export const Ledger = () => {
  const [data, setData] = useState("")
  const client = new Client(ws as string)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await client.connect();
        const index: any = await client.request({
          command: "ledger_current",
        });
        const ledger = JSON.stringify(await index.result.ledger_current_index, null, 2);
        setData(ledger)
        await client.disconnect()
        
      } catch (error) {
        throw new Error()
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="mb-3 text-left">
        LedgerIndex: {data}
      </div>
    </>
  )
}
