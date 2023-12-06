"use client"

import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import { Client } from "xrpl";

const ws = process.env.WS_URI

export const Xaman = () => {
  const [price, setPrice] = useState<{ XRP?: string; XAH?: string }>();
  const [balance, setBalance] = useState("")
  const { xumm, userInfo } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const price: any = await xumm.helpers?.getRates('JPY');
      setPrice(price);
    };

    fetchData()
    const interval = setInterval(fetchData, 40000)
    return () => clearInterval(interval);
  }, [xumm]);

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client(ws as string);
      await client.connect();
      const balance = await client.getXrpBalance(userInfo.account as string);
      setBalance(balance);
      await client.disconnect();
    }

    fetchData();
  }, [userInfo]);

  return (
    <>
      {balance && (
        <div className="text-lg my-1">
          Balance: {balance} XAH
        </div>
      )}
      <div className="text-xl text-accent text-right">
        XRP: {JSON.stringify(price?.XRP)} JPY
        <br />
        XAH: {JSON.stringify(price?.XAH)} JPY
      </div>
    </>
  )
}
