"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";
import { convertStringToHex, Client } from "xrpl";
import { JAN } from "./JAN";

export const Button = () => {
  const { userInfo, xumm } = useUser();
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<any | undefined>(undefined);
  const [check, setCheck] = useState<any | undefined>(undefined);
  const [trust, setTrust] = useState<string | undefined>(undefined);
  const [userHand, setUserHand] = useState<string | undefined>(undefined);
  const ws = "wss://xahau-test.net"
  const shhh = "rQqqqqJyn6sKBzByJynmEK3psndQeoWdP"

  const handlePayloadStatus = async (payload?: any) => {
    const checkPayloadStatus = setInterval(async () => {
      const status: any = await xumm.payload?.get(payload?.uuid as string);
      if (status?.meta.resolved && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(status);
        setQr(undefined);
      } else if (status?.meta.resolved && !tx && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(status);
        setQr(undefined);
      }
    }, 20000);
  };

  const push = async (payload?: any) => {
    if (payload?.pushed) {
      alert('Payload `' + payload?.uuid + '` pushed to your phone.');
    } else {
      alert('Payload not pushed, opening payload...');
      window.open(payload?.next.always);
    }
  }

  const Payment = async () => {
    setTx(undefined);
    const jank = convertStringToHex(userHand || "janken")

    const payload = await xumm.payload?.create({
      TransactionType: 'Payment',
      Destination: shhh,
      Fee: 5890,
      Memos: [
        {
          Memo: {
            MemoData: jank,
            MemoFormat: "746578742F706C61696E",
            MemoType: convertStringToHex("hand")
          }
        },
        {
          Memo: {
            MemoData: convertStringToHex("pon"),
            MemoFormat: "746578742F706C61696E",
            MemoType: convertStringToHex("name")
          }
        },
      ],
    });
    setQr(payload?.refs.qr_png);
    await xumm.xapp?.openSignRequest(payload);
    push(payload)
    handlePayloadStatus(payload);
  };

  const CheckCash = async () => {
    if (check) {
      setTx(undefined);
      const payload = await xumm.payload?.create({
        TransactionType: 'CheckCash',
        Amount: check.SendMax,
        CheckID: check.index,
        Fee: 5890,
      });
      setQr(payload?.refs.qr_png);
      await xumm.xapp?.openSignRequest(payload);
      push(payload)
      handlePayloadStatus(payload);
    }
  };

  const TrustSet = async () => {
    setTx(undefined);

    const payload = await xumm.payload?.create({
      TransactionType: 'TrustSet',
      Flags: '262144',
      LimitAmount: {
        currency: 'JAN',
        issuer: shhh,
        value: '10000'
      },
      Fee: 5890,
    });
    setQr(payload?.refs.qr_png);
    await xumm.xapp?.openSignRequest(payload);
    push(payload)
    handlePayloadStatus(payload);
  };

  const Swap = async (event: React.FormEvent<HTMLFormElement>) => {
    setTx(undefined);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const max = formData?.get("amount") as any;

    const payload = await xumm.payload?.create({
      TransactionType: 'Payment',
      Destination: userInfo?.account,
      SendMax: {
        currency: "JAN",
        value: max as string,
        issuer: shhh
      },
    });
    setQr(payload?.refs.qr_png);
    await xumm.xapp?.openSignRequest(payload);
    push(payload)
    handlePayloadStatus(payload);
  };
  const donate = async () => {
    setTx(undefined);
    const payload = await xumm.payload?.create({
      TransactionType: 'Payment',
      Destination: "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
      Fee: 5890,
      Memos: [
        {
          Memo: {
            MemoData: convertStringToHex("Internet Archive"),
            MemoFormat: "746578742F706C61696E",
            MemoType: convertStringToHex("donate")
          }
        },
      ],
    });
    setQr(payload?.refs.qr_png);
    await xumm.xapp?.openSignRequest(payload);
    push(payload)
    handlePayloadStatus(payload);
  };

  const checklist = async () => {
    if (userInfo.account) {
      const client = new Client(ws as string)
      await client.connect()
      const info: any = await client.request({
        command: "account_objects",
        account: userInfo.account,
        type: "check"
      });
      await client.disconnect()

      let found = false;
      if (info.result.account_objects && info.result.account_objects.length > 0) {
        info.result.account_objects.forEach((checklist: any) => {
          if (checklist.Account === shhh) {
            setCheck(checklist);
            found = true;
          }
        });
        if (!found) {
          setCheck(undefined);
        }
      } else {
        setCheck(undefined);
      }
    }
  }
  useEffect(() => {
    if (userInfo.account) {
      checklist();
    }
  }, [userInfo.account]);

  const trustlist = async () => {
    if (userInfo.account) {
      const client = new Client(ws as string)
      await client.connect()
      const info: any = await client.request({
        command: "account_lines",
        account: userInfo.account,
        peer: shhh
      });
      await client.disconnect()
      const list = info.result.lines[0]
      if (list) {
        setTrust(list.balance)
      }
      else {
        setTrust(undefined)
      }
    }
  }
  useEffect(() => {
    if (userInfo.account) {
      trustlist();
    }
  }, [userInfo.account]);

  const handleUserHandChange = (newHand: string) => {
    setUserHand(newHand);
  };

  return (
    <div className="text-primary-content">
      {userInfo.account && (
        <div className="stats stats-vertical lg:stats-horizontal">

          {check ? (
            <>
              <div className="stat">
                <div className="stat-title text-accent">Check Cash</div>
                <div className="stat-value font-mono text-3xl">{(check.SendMax / 1000000)}</div>
                <div className="stat-desc text-xl">XAH</div>
                <div className="stat-actions">
                  <button
                    onMouseDown={CheckCash}
                    className="btn bg-[#3051FC] hover:bg-gray text-3xl text-white">
                    Withdraw
                  </button>
                </div>
                <div className="stat-actions mx-auto">
                  <Imagine
                    src={"/donate-with-xumm.png"}
                    width={220}
                    height={100}
                    alt="sign"
                    onClick={donate}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="stat">
              <div className="stat-title">No deposite.</div>
              <div className="stat-value">...</div>
              <div className="stat-actions mx-auto">
                <Imagine
                  src={"/donate-with-xumm.png"}
                  width={220}
                  height={100}
                  alt="sign"
                  onClick={donate}
                />
              </div>
            </div>
          )}

          <div className="stat">
            <div className="stat-figure">
              {qr && <Imagine src={qr} alt="QR" height={150} width={150} className="mx-auto" />}
            </div>
            <div className="stat-title">Shhh...</div>
            <div className="stat-value font-mono">{trust ? "Jan Ken Pon" : "deposit"}</div>
            {/* {trust && */}
            <div className="stat-actions">
              <JAN userHand={userHand} onUserHandChange={handleUserHandChange} />
            </div>
            {/* } */}
            <div className="stat-actions">
              <Imagine
                src={"/pay-with-xumm.png"}
                width={350}
                height={100}
                alt="sign"
                onClick={Payment}
              />
            </div>

            {tx && (
              <div className="stat-desc">
                <div className="my-2 card bordered border-primary lg:w-96 w-64">
                  <details className="collapse collapse-arrow border border-base-300 bg-base-100">
                    <summary className="collapse-title text-secondary lg:text-xl">
                      {JSON.stringify(tx.response.resolved_at)}
                    </summary>
                    <div className="collapse-content">
                      <pre className="text-left text-success text-xs overflow-scroll">
                        {JSON.stringify(tx, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            )}

          </div>

          {trust ? (
            <div className="stat">
              <div className="stat-title">Balance</div>
              <div className="stat-value font-mono text-3xl">¥{trust} JAN</div>
              <div className="stat-desc">Swap JAN to XAH with DEX</div>
              <div className="stat-actions">
                <form onSubmit={Swap} className="my-4 join join-vertical">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="SendMax"
                    className="input input-bordered w-full join-item"
                  />
                  <button className="btn bg-[#3051FC] hover:bg-gray join-item text-3xl text-white font-bold">Swap</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="stat">
              <div className="stat-title">Game token</div>
              <div className="stat-value font-mono text-accent">JAN</div>
              <div className="stat-desc">Total value 10000 JAN</div>
              <div className="stat-actions">
                <button
                  onMouseDown={TrustSet}
                  className="text-3xl btn bg-[#3051FC] hover:bg-gray text-white">
                  TrustSet
                </button>
              </div>
            </div>
          )
          }
        </div>
      )}
    </div>
  );
};
