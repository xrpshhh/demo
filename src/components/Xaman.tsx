"use client"

import { useUser} from "@/components/UserProvider";
import { useState } from "react";
import { Client } from "xrpl";

export const Xaman = () => {
  const [data, setData] = useState("")
  const [balance, setBalance] = useState("")
  const { xumm, userInfo } = useUser();
  (async () => {
    // console.log(await xumm.helpers?.getCuratedAssets());
    const client = new Client('wss://xahau-test.net')
    await client.connect();
    const info: any = await client.request({
      command: "account_info",
      account: userInfo.account
    });
    const balance = await client.getXrpBalance(userInfo.account || "");
    const accountData = JSON.stringify(await info.result.account_data, null, 2);
    setData(accountData)
    setBalance(balance);
    await client.disconnect()
  })
  ()

  return (
    <>
      {userInfo.account && (
        <>
          Balance: {balance}
          {/* {data} */}
        </>
      )}
    </>
  )
}
