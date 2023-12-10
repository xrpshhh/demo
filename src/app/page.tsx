"use client"

import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { Button } from "@/components/Button";
import { Imagine } from "@/components/Imagine";

export default function App() {
  const { xumm, userInfo } = useUser();

  const [data, setData] = useState()
  const [fee, setFee] = useState("")
  const [price, setPrice] = useState<{ XRP: number; XAH: number }>();
  const [balance, setBalance] = useState<any>()
  const [total, setTotal] = useState<any>()

  const ws = "wss://xahau-test.net"
  const shhh = "rQqqqqJyn6sKBzByJynmEK3psndQeoWdP"

  const handleSign = async () => {
    await xumm.authorize();
  };

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client(ws);
      await client.connect();
      const fee: any = await client.request({
        command: "fee",
      });
      const ledger = await fee.result.ledger_current_index;
      setData(ledger)
      setFee(fee.result.drops.open_ledger_fee)
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
      const client = new Client(ws);
      await client.connect();
      const balance: any = await client.getXrpBalance(userInfo.account as string);
      setBalance(balance);

      await client.disconnect();
    }

    fetchData();
  }, [userInfo.account]);

  useEffect(() => {
    const fetchData = async () => {
      const client = new Client(ws);
      await client.connect();
      const total: any = await client.getXrpBalance(shhh);
      setTotal(total);

      await client.disconnect();
    }

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const alertDiv = document.querySelector('.alert');
      if (alertDiv instanceof HTMLElement) {
        alertDiv.style.display = 'none';
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='pt-20 text-center container mx-auto'>
      <div className="m-1 card border-2 border-primary rounded-box">
      <div role="alert" className="alert">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Currently in beta version.</span>
        </div>

        <div className="text-primary-content">
          <div className="stats stats-vertical lg:stats-horizontal">

            <div className="stat">
              <div className="stat-figure text-secondary text-sm">
                <Imagine
                  src="/xrpl.png"
                  width={78}
                  height={78}
                  alt="xrp"
                />
                fee: {fee}
              </div>
              <div className="stat-title">LedgerIndex</div>
              <div className="stat-value">
                <span className="countdown font-mono text-2xl">{data}</span>
              </div>
              <div className="stat-desc">{ws}</div>
            </div>

            <div className="stat">
              <div className="stat-title">XRP Shhh: Total funds</div>
              <div className="stat-value font-mono lg:text-3xl">{total}</div>
              <div className="stat-desc text-xl">XAH</div>
              <div className="stat-title">HookAccount</div>
              <div className="stat-value text-xs text-accent">{shhh}</div>
            </div>

            {price && (
              <>
                <div className="stat">
                  <div className="stat-title">Price</div>
                  <div className="stat-value">
                    <span className="countdown font-mono my-2 text-3xl lg:text-xl">XRP ¥{price.XRP.toFixed(2)}</span>
                  </div>
                  <div className="stat-value">
                    <span className="countdown font-mono my-2 text-3xl lg:text-xl">XAH ¥{price?.XAH.toFixed(2)}</span>
                  </div>
                  <div className="stat-desc text-xl">¥JPY</div>
                </div>
              </>
            )}
            {userInfo.account && (
              <div className="stat">
                <div className="stat-title">Balance</div>
                <div className="stat-value font-mono text-3xl">{balance}</div>
                <div className="stat-desc text-xl">XAH</div>
                <div className="stat-desc text-xs font-bold text-accent">{userInfo.account}</div>
              </div>
            )}
          </div>
        </div>

        {!userInfo.account && (
          <div className="stats stats-vertical lg:stats-horizontal mx-auto">
            <div className="stat">
              <div className="stat-actions">
                <Imagine
                  src={"/sign-in-with-xumm.png"}
                  width={350}
                  height={100}
                  alt="sign"
                  onClick={handleSign}
                />
              </div>
            </div>
          </div>
        )}
        <Button />

        <div className="text-primary-content">
          <div className="stats">

            <div className="stat">
              <div className="stat-title">min deposit</div>
              <div className="stat-value font-mono">2</div>
              <div className="stat-desc">XAH</div>
            </div>

            <div className="stat">
              <div className="stat-title">min reserve</div>
              <div className="stat-value font-mono">0.2</div>
              <div className="stat-desc">XAH</div>
            </div>

          </div>
          <div className="stats">

            <div className="stat">
              <div className="stat-title">Charge</div>
              <div className="stat-value font-mono">0.02</div>
              <div className="stat-desc">XAH</div>
            </div>

            <div className="stat">
              <div className="stat-title">APY</div>
              <div className="stat-value font-mono">4%</div>
              <div className="stat-desc">auto-add rewards</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
