"use client";

import { useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";

// Define the type for the transaction status
type TransactionStatus = {
  meta?: any;
  application?: any;
  payload?: any;
  response?: any;
  custom_meta?: any;
};

// Payload component
export const Swap = () => {
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
        setTx(status);
        setQr(undefined);
      } else if (status?.meta.resolved && !tx && !status?.meta.cancelled) {
        clearInterval(checkPayloadStatus);
        setTx(status);
        setQr(undefined);
      }
    }, 20000);
  };

  // Handle the account set transaction
  const handleSwap = async (event: React.FormEvent<HTMLFormElement>) => {
    setTx(undefined);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const from = (formData?.get("amount") as any * 1000000);
    const to = formData?.get("currency") as string
    // const currency = (formData?.get("currency") as string).toLowerCase();

    const payload = await xumm.payload?.create({
      TransactionType: 'Payment',
      Destination: userInfo?.account,
      Amount: to,
      SendMax: {
        // currency: currency as string,
        currency: "JAN",
        value: from,
        issuer: "r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ"
      },
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

  return (
    <>
      {userInfo.account ? (
        <>
          {/* Account set form */}
          <form onSubmit={handleSwap} className="m-4 join join-vertical">
            {/* Input fields */}
            <input
              type="text"
              name="currency"
              id="currency"
              // defaultValue="JAN"
              placeholder="to XAH"
              className="input input-bordered w-full join-item"
            />
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="from JAN"
              className="input input-bordered w-full join-item"
            />
            {/* Submit button */}
            <button className="btn btn-neutral join-item text-2xl">SWAP</button>
          </form>
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
      ) : (<div></div>)}
    </>
  );
};
