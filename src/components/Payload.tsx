"use client";

import { useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";
import { convertStringToHex } from "xrpl";

// Define the type for the transaction status
type TransactionStatus = {
  meta?: any;
  application?: any;
  payload?: any;
  response?: any;
  custom_meta?: any;
};

// Payload component
export const Payload = () => {
  // Get user information and Xumm instance
  const { userInfo, xumm } = useUser();

  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);

  // Handle the payload status and polling
  const handlePayloadStatus = async (payload: any) => {
    const checkPayloadStatus = setInterval(async () => {
      const status = await xumm.payload?.get(payload?.uuid as string);
      if (status?.meta.resolved && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setQr(undefined);
      } else if (status?.meta.resolved && !tx && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(status);
        setQr(undefined);
      }
    }, 20000);
  };

  // Handle the payment process
  const handlePayment = async () => {
    setTx(undefined);

    const payload = await xumm.payload?.create({
      // TransactionType: 'SignIn', //擬似トランザクション
      TransactionType: 'Payment',
      Destination: 'r9BUM9z14j7bLFzQHRfurWNdNKYSABdGtE',
      Amount: String(123_456),
      Fee: '123',
      // NetworkID: '21338',
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

  // Handle the account set transaction
  const handleAccountSet = async (event: React.FormEvent<HTMLFormElement>) => {
    setTx(undefined);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const domain = formData?.get("domain");
    const email = formData?.get("email");

    const domainHex = convertStringToHex(domain as string);

    const crypto = require('crypto');
    const md5hex = (str: string) => {
      const hash = crypto.createHash('md5').update(str, 'binary').digest('hex');
      return hash.toUpperCase();
    };
    const emailhash = md5hex(email as string);

    const payload = await xumm.payload?.create({
      TransactionType: 'AccountSet',
      Domain: domainHex,
      EmailHash: emailhash,
      Memos: ["It's My Infomation"],
      Fee: '1000000',
      NetworkID: '21338',
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

  // Handle the sign action
  const handleSign = async () => {
    await xumm.authorize();
  };

  return (
    <>
      {userInfo.account !== undefined ? (
        <>
          {/* Payment button */}
          <button className="m-4 btn btn-ghost btn-circle btn-lg text-5xl" onMouseDown={handlePayment}>
            💸
          </button>
          {/* Account set form */}
          <form onSubmit={handleAccountSet} className="m-4 join join-vertical">
            {/* Input fields */}
            <input
              type="text"
              name="domain"
              id="domain"
              placeholder="example.com"
              className="input input-bordered w-full join-item"
            />
            <input
              type="text"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              className="input input-bordered w-full join-item"
            />
            {/* Submit button */}
            <button className="btn btn-neutral join-item">Set</button>
          </form>
          {/* Display QR code */}
          {qr && <Imagine src={qr} alt="QR" height={150} width={150} className="mx-auto m-4" />}
          {/* Display transaction details */}
          {tx && (
            <div className="mx-auto">
              <dl className="truncate text-left">
                <dt>Transaction: </dt>
                <dd>{tx.payload.tx_type}</dd>
                <dt>Stats: </dt>
                {tx.meta.resolved && <dd>Success</dd>}
                <dt>From: </dt>
                <dd>{tx.response.account}</dd>
                <dt>Txid: </dt>
                <dd>{tx.response.txid}</dd>
                <dt>Tx:Hex: </dt>
                <dd>{tx.response.hex}</dd>
                <dt>Time: </dt>
                <dd>{tx.response.resolved_at}</dd>
                <dt>Tx_uuid: </dt>
                <dd>{tx.meta.uuid}</dd>
              </dl>
            </div>
          )}
        </>
      ) : (
        // Sign button for users without an account
        <button className="m-4 btn btn-ghost btn-circle btn-lg text-5xl" onMouseDown={handleSign}>
          ✍️
        </button>
      )}
    </>
  );
};
