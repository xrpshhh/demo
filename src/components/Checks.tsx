"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";
import { Client } from 'xrpl';

// Define the type for the transaction status
type TransactionStatus = {
  meta?: any;
  application?: any;
  payload?: any;
  response?: any;
  custom_meta?: any;
};

const ws = process.env.WS_URI

// Payload component
export const Checks = () => {
  const { userInfo, xumm } = useUser();
  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);
  const [check, setCheck] = useState<any | undefined>(undefined);

  const handlePayloadStatus = async (payload: any) => {
    const checkPayloadStatus: any = setInterval(async () => {
      const status = await xumm.payload?.get(payload?.uuid as string);
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
      const checklist = info.result.account_objects[0]
      if (checklist) {
        setCheck(checklist)
      }
      else {
        setCheck(undefined)
      }
    }
  }
  useEffect(() => {
    if (userInfo.account) {
      checklist();
    }
  }, [userInfo.account]);

  const checkcreate = async () => {
    setTx(undefined);
    const payload = await xumm.payload?.create({
      TransactionType: 'CheckCreate',
      Destination: 'r9BUM9z14j7bLFzQHRfurWNdNKYSABdGtE',
      SendMax: String(123_456),
      Fee: 1234,
    });
    setQr(payload?.refs.qr_png);
    await xumm.xapp?.openSignRequest(payload);

    if (payload?.pushed) {
      alert('Payload `' + payload?.uuid + '` pushed to your phone.');
    } else {
      alert('Payload not pushed, opening payload...');
      window.open(payload?.next.always);
    }
    handlePayloadStatus(payload);
  };

  const checkcash = async () => {
    if (check) {
      setTx(undefined);
      const payload = await xumm.payload?.create({
        TransactionType: 'CheckCash',
        Amount: check.SendMax,
        CheckID: check.index,
        // Fee: 123,
      });
      setQr(payload?.refs.qr_png);
      await xumm.xapp?.openSignRequest(payload);

      if (payload?.pushed) {
        alert('Payload `' + payload?.uuid + '` pushed to your phone.');
      } else {
        alert('Payload not pushed, opening payload...');
        window.open(payload?.next.always);
      }
      handlePayloadStatus(payload);
    }
  };

  const checkcancel = async () => {
    checklist()
    if (check) {
      setTx(undefined);
      const payload = await xumm.payload?.create({
        TransactionType: 'CheckCancel',
        CheckID: check?.index as any,
      });
      setQr(payload?.refs.qr_png);
      await xumm.xapp?.openSignRequest(payload);

      if (payload?.pushed) {
        alert('Payload `' + payload?.uuid + '` pushed to your phone.');
      } else {
        alert('Payload not pushed, opening payload...');
        window.open(payload?.next.always);
      }
      handlePayloadStatus(payload);
    }
  };

  return (
    <>
      {userInfo.account ? (
        <>
          <button onMouseDown={checkcreate} className="m-3 btn btn-neutral btn-lg text-xl">
            CheckCreate
          </button>

          {check ? (
            <div className="stat value">
              The amount you can currently withdraw is {(check.SendMax / 1000000)} XAH
            </div>
          ) : (
            <div>No deposits.</div>
          )}
          <button onMouseDown={checkcash} className="m-3 btn btn-neutral btn-lg text-xl">
            Withdraw cash and rewards
          </button>

          {/* <button onMouseDown={checkcancel} className="m-3 btn btn-neutral btn-lg text-xl">
            CheckCancel
          </button> */}
          
          {/* Display QR code */}
          {qr && <Imagine src={qr} alt="QR" height={150} width={150} className="mx-auto m-4" />}
          {/* Display transaction details */}
          {tx && (
            <div className="mx-auto">
              <dl className="truncate text-left">
                <dt>Transaction: </dt><dd>{tx.payload.tx_type}</dd>
                <dt>Stats: </dt>{tx.meta.resolved && <dd>Success</dd>}
                <dt>From: </dt><dd>{tx.response.account}</dd>
                <dt>Txid: </dt><dd>{tx.response.txid}</dd>
                <dt>Tx:Hex: </dt><dd>{tx.response.hex}</dd>
                <dt>Time: </dt><dd>{tx.response.resolved_at}</dd>
                <dt>Tx_uuid: </dt><dd>{tx.meta.uuid}</dd>
              </dl>
            </div>
          )}
        </>
      ) : (<div></div>)
      }
    </>
  )
};
