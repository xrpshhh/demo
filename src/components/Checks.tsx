"use client";

import { useState } from "react";
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

// Payload component
export const Checks = () => {
  const { userInfo, xumm } = useUser();

  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);

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

  const checkcreate = async () => {
    setTx(undefined);
    const payload = await xumm.payload?.create({
      TransactionType: 'CheckCreate',
      Destination: 'r9BUM9z14j7bLFzQHRfurWNdNKYSABdGtE',
      SendMax: String(123_456),
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
    setTx(undefined);
    const client = new Client("wss://testnet.xrpl-labs.com")
    await client.connect()
    const info: any = await client.request({
      command: "account_objects",
      account: userInfo?.account,
      type: "check"
    });
    const checklist = info.result.account_objects[0]

    const payload = await xumm.payload?.create({
      TransactionType: 'CheckCash',
      Amount: checklist.SendMax,
      CheckID: checklist.index,
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
    await client.disconnect()
  };
  const checkcancel = async () => {
    setTx(undefined);
    const client = new Client("wss://testnet.xrpl-labs.com")
    await client.connect()
    const info: any = await client.request({
      command: "account_objects",
      account: userInfo?.account,
      type: "check"
    });
    const checklist = info.result.account_objects[0]

    const payload = await xumm.payload?.create({
      TransactionType: 'CheckCancel',
      CheckID: checklist.index,
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
    await client.disconnect()
  };

  return (
    <>
      {userInfo.account ? (
        <>
          <button onMouseDown={checkcreate} className="m-3 btn btn-neutral btn-lg text-2xl">
            CheckCreate
          </button>
          <button onMouseDown={checkcash} className="m-3 btn btn-neutral btn-lg text-2xl">
            CheckCash
          </button>
          <button onMouseDown={checkcancel} className="m-3 btn btn-neutral btn-lg text-2xl">
            CheckCancel
          </button>
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
      ):(<div></div>)
    }
  </>
  )
};
