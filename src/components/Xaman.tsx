"use client"

import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import { Client } from "xrpl";

const ws = process.env.WS_URI

export const Xaman = () => {
  // const [data, setData] = useState("")
  const [balance, setBalance] = useState("")
  const { userInfo } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) {
      const client = new Client(ws as string);
      await client.connect();
      const info = await client.request({
        command: "account_info",
        account: userInfo?.account
      });
      const balance = await client.getXrpBalance(userInfo.account as string);
      // const accountData = JSON.stringify(await info.result.account_data, null, 2);
      // setData(accountData)
      setBalance(balance);
      await client.disconnect();
    }};

    fetchData();
  }, []);

  return (
    <>
      {balance && (
        <div className="text-lg my-1">
          WalletBalance: {balance}XRP
          {/* {data} */}
        </div>
      )}
    </>
  )
}
