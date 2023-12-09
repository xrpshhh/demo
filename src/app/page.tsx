"use client"

import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { Button } from "@/components/Button";
import { Imagine } from "@/components/Imagine";

export default function App() {
  const { xumm, userInfo } = useUser();

  const [data, setData] = useState("")
  const [price, setPrice] = useState<{ XRP: number; XAH: number }>();
  const [balance, setBalance] = useState<any>()

  const ws = process.env.WS_URI

  const handleSign = async () => {
    await xumm.authorize();
  };

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client(ws as string);
      await client.connect();
      const index: any = await client.request({
        command: "ledger_current",
      });
      const ledger = await index.result.ledger_current_index as string;
      setData(ledger)
      await client.disconnect()
    }
    fetchData()
    const interval = setInterval(fetchData, 4000)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const price: any = await xumm.helpers?.getRates('JPY');
      setPrice(price);
    };

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval);
  }, [xumm]);

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client(ws as string);
      await client.connect();
      const balance: any = await client.getXrpBalance(userInfo.account as string);
      setBalance(balance);
      await client.disconnect();
    }

    fetchData();
  }, [userInfo.account]);

  return (
    <div className='p-4 py-20 text-center container mx-auto'>
      <div className="card border-2 border-primary rounded-box">

        <div className="text-primary-content">
          <div className="stats stats-vertical lg:stats-horizontal">

            <div className="stat">
              <div className="stat-figure text-secondary">
                <Imagine
                  src="/ipfs/xrpl.png"
                  width={78}
                  height={78}
                  alt="xrp"
                />
              </div>
              <div className="stat-title">LedgerIndex</div>
              <div className="stat-value">
                <span className="countdown font-mono text-xl">{data}</span>
              </div>
              <div className="stat-desc">{ws}</div>
            </div>

            {!userInfo.account && (
              <div className="stat">
                <div className="stat-actions">
                  <Imagine
                    src={"/ipfs/sign-in-with-xumm.png"}
                    width={300}
                    height={100}
                    alt="sign"
                    onClick={handleSign}
                  />
                </div>
              </div>
            )}

            {userInfo.account && (
              <div className="stat">
                <div className="stat-title">Balance</div>
                <div className="stat-value font-mono">{balance}</div>
                <div className="stat-desc">XAH</div>
              </div>
            )}

            {price && (
              <>
                <div className="stat">
                  <div className="stat-title">XRP</div>
                  <div className="stat-value">
                    <span className="countdown font-mono">¥{price.XRP.toFixed(2)}</span>
                  </div>
                  <div className="stat-desc">JPY</div>
                </div>

                <div className="stat">
                  <div className="stat-title">XAH</div>
                  <div className="stat-value">
                    <span className="countdown font-mono">¥{price?.XAH.toFixed(2)}</span>
                  </div>
                  <div className="stat-desc">JPY</div>
                </div>
              </>
            )}
          </div>
        </div>

        <Button />

        <div className="text-primary-content">
          <div className="stats stats-vertical lg:stats-horizontal">

            <div className="stat">
              <div className="stat-title">Hooks Account</div>
              <div className="stat-value text-xs text-accent my-3 font-mono md:text-sm">r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ</div>
            </div>

            <div className="stat">
              <div className="stat-title">Commission fixed</div>
              <div className="stat-value font-mono">0.02XAH</div>
            </div>

            <div className="stat">
              <div className="stat-title">Minimum reserve</div>
              <div className="stat-value font-mono">0.2XAH</div>
            </div>

            <div className="stat">
              <div className="stat-title">Miminum deposite</div>
              <div className="stat-value font-mono">2XAH</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
