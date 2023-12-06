"use client"

import { useEffect, useState } from "react";
import { Client } from "xrpl";

export const Ledger = () => {
  const ws = process.env.WS_URI
  const client = new Client(ws as string)
  const [data, setData] = useState("")

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await client.connect();
        const index: any = await client.request({
          command: "ledger_current",
        });
        const ledger = await index.result.ledger_current_index as string;
        setData(ledger)
        await client.disconnect()
      } catch (error) {
        throw new Error()
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="mb-3 text-left text-info">
        {ws}
        <br />
        LedgerIndex: {data}
      </div>
    </>
  )
}
