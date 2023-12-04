"use client"

import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import { Client } from "xrpl";

export const Xaman = () => {
  // const [data, setData] = useState("")
  const [balance, setBalance] = useState("")
  const { userInfo } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client('wss://testnet.xrpl-labs.com');
      await client.connect();
      const info = await client.request({
        command: "account_info",
        account: userInfo.account
      });
      const balance = await client.getXrpBalance(userInfo.account as string);
      // const accountData = JSON.stringify(await info.result.account_data, null, 2);
      // setData(accountData)
      setBalance(balance);
      await client.disconnect();
    };

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
