"use client";

import { useEffect, useState } from "react";
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
export const Payload = () => {
  // Get user information and Xumm instance
  const { userInfo, xumm } = useUser();

  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);
  const [price, setPrice] = useState<{ XRP?: string; XAH?: string }>();
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
      Amount: String(value) || String(123_456),
      // HooksPrameters: [{}]
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

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const price = await xumm.helpers?.getRates('JPY');
        setPrice(price as any);
      } catch (error) {
        throw new Error()
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>{price && (<>
      <p className="text-xl text-accent text-right">XRP: {JSON.stringify(price?.XRP)} JPY</p>
      <p className="text-xl text-accent text-right">XAH: {JSON.stringify(price?.XAH)} JPY</p>
      </>)}
      {userInfo.account ? (
        <>
          {/* Payment button */}
          {/* Account set form */}
          <form onSubmit={handlePayment} className="m-4 join join-vertical">
            {/* Input fields */}
            <input
              type="number"
              name="amount"
              id="amount"
              className="input input-bordered w-full join-item"
            />
            {/* Submit button */}
            <button className="btn btn-neutral join-item text-2xl">Send</button>
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
      ) : (
        // Sign button for users without an account
        <button className="m-4 btn btn-primary btn-lg text-3xl" onMouseDown={handleSign}>
          Connect
        </button>
      )}
    </>
  );
};
