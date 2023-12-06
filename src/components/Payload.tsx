"use client";

import { useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";

export const Payload = () => {
  type TransactionStatus = {
    meta?: any;
    application?: any;
    payload?: any;
    response?: any;
    custom_meta?: any;
  };
  // Get user information and Xumm instance
  const { userInfo, xumm } = useUser();
  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);

  // Handle the payload status and polling
  const handlePayloadStatus = async (payload: any) => {
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

  // Handle the payment process
  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    setTx(undefined);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = formData?.get("amount");
    const value = (amount as any) * 1000000

    const payload = await xumm.payload?.create({
      TransactionType: 'Payment',
      Destination: 'r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ',
      Amount: String(value),
      Fee: 123,
      // HooksPrameters: [
      //   {},
      //   {},
      //   {}
      // ]
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

  return (<>
    {userInfo.account ? (
      <>
        <div className="m-2 text-left text-warning text-sm">
          The minimum deposit amount is 2XAH.
          <br />
          a balance of 0.2XAH is required to withdraw.
          <br />
          hooks commission is a fixed 0.02XAH
        </div>
        <form onSubmit={handlePayment} className="m-4 join join-vertical">
          {/* Input fields */}
          <input
            type="number"
            name="amount"
            id="amount"
            defaultValue={2}
            className="input input-bordered w-full join-item"
          />
          {/* Submit button */}
          <button className="btn btn-neutral join-item text-xl">You send to 🪝</button>
        </form>
        {/* Display QR code */}
        {qr && <Imagine src={qr} alt="QR" height={150} width={150} className="mx-auto m-4" />}
        {/* Display transaction details */}
        {tx && (
          <div className="border border-secondary rounded-box">
            <details>
              <summary className="collapse-title text-xl text-secondary font-medium">
                TxData
              </summary>
              <div className="collapse-content">
                <pre className="text-success text-sm overflow-scroll">
                  {/* { <dt>Transaction: </dt><dd>{tx.payload.tx_type}</dd>
                <dt>Stats: </dt>{tx.meta.resolved && <dd>Success</dd>}
                <dt>From: </dt><dd>{tx.response.account}</dd>
                <dt>Txid: </dt><dd>{tx.response.txid}</dd>
                <dt>Tx:Hex: </dt><dd>{tx.response.hex}</dd>
                <dt>Time: </dt><dd>{tx.response.resolved_at}</dd>
                <dt>Tx_uuid: </dt><dd>{tx.meta.uuid}</dd> */}
                  {JSON.stringify(tx, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </>
    ) : (
      // Sign button for users without an account
      <button className="m-4 btn btn-primary btn-lg text-accent text-3xl" onMouseDown={handleSign}>
        Connect
      </button>
    )
    }
  </>
  );
};
