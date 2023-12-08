"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";
import { convertStringToHex, Client } from "xrpl";
import { JAN } from "./JAN";

export const Button = () => {
  const { userInfo, xumm } = useUser();
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<string | undefined>(undefined);
  const [check, setCheck] = useState<any | undefined>(undefined);
  const [trust, setTrust] = useState<string | undefined>(undefined);
  const [userHand, setUserHand] = useState<string | undefined>(undefined);
  const ws = process.env.WS_URI

  const handlePayloadStatus = async (payload?: any) => {
    const checkPayloadStatus = setInterval(async () => {
      const status: any = await xumm.payload?.get(payload?.uuid as string);
      if (status?.meta.resolved && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(JSON.stringify(status, null, 2));
        setQr(undefined);
      } else if (status?.meta.resolved && !tx && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(JSON.stringify(status, null, 2));
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
      Destination: 'r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ',
      Fee: 589,
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
      // HooksPrameters: [{userInfo.account: jank}]
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
        Fee: 589,
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
        issuer: 'r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ',
        value: '10000'
      },
      Fee: 589,
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
        issuer: "r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ"
      },
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
          if (checklist.Account === "r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ") {
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
        peer: "r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ"
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

          <div className="stat">
            <div className="stat-figure">
              {qr && <Imagine src={qr} alt="QR" height={150} width={150} className="mx-auto m-4" />}
            </div>
            <div className="stat-title">Send for HooksAccount</div>
            <div className="stat-actions">
              {/* {trust && */}
              <JAN userHand={userHand} onUserHandChange={handleUserHandChange} />
              {/* } */}
              <Imagine
                src={"https://ipfs.io/ipfs/QmXoTW4UaV2LC972UcFWLt9QsrPAe6A6qauxAqXPsVmt5A/pay-with-xumm.png"}
                width={300}
                height={100}
                alt="sign"
                onClick={Payment}
              />
              <div className="stat-desc">
                {tx && (
                  <div className="max-w-xs card bordered border-primary card">
                    <details className="collapse collapse-arrow border border-base-300 bg-base-100">
                      <summary className="collapse-title text-xl text-secondary">
                        Payload
                      </summary>
                      <div className="collapse-content">
                        <pre className="text-left text-success text-xs overflow-scroll">
                          {tx}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>

          {check ? (
            <>
              <div className="stat">
                <div className="stat-title">max withdraw</div>
                <div className="stat-value font-mono">{(check.SendMax / 1000000)}</div>
                <div className="stat-desc">XAH</div>
                <div className="stat-actions">
                  <button
                    onMouseDown={CheckCash}
                    className="my-2 mx-auto btn bg-[#3051FC] hover:bg-[#030B36] btn-lg text-2xl">
                    {/* Withdraw */}
                    CheckCash
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="stat">
              <div className="stat-title">No deposit.</div>
            </div>
          )}

          {trust ? (
            <div className="stat">
              <div className="stat-title">Balance</div>
              <div className="stat-value font-mono">¥{trust} JAN</div>
              <div className="stat-desc">Swap JAN to XAH with DEX</div>
              <div className="stat-actions">
                <form onSubmit={Swap} className="my-4 join join-vertical">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    min={0.2}
                    defaultValue={0.2}
                    placeholder="SendMax ¥JAN"
                    className="input input-bordered w-full join-item"
                  />
                  <button className="btn bg-[#3051FC] hover:bg-[#030B36] join-item text-2xl">Swap</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="stat">
              <div className="stat-title">No TrustLine</div>
              <div className="stat-actions">
                <button
                  onMouseDown={TrustSet}
                  className="my-2 btn bg-[#3051FC] hover:bg-[#030B36] btn-lg">
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
