"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { Imagine } from "./Imagine";
import { Client } from "xrpl";
import { Swap } from "./Swap";

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
export const TrustSet = () => {
  // Get user information and Xumm instance
  const { userInfo, xumm } = useUser();

  // Define state variables
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionStatus | undefined>(undefined);
  const [trust, setTrust] = useState<string | undefined>(undefined);

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
  const Trust = async () => {
    setTx(undefined);

    const payload = await xumm.payload?.create({
      TransactionType: 'TrustSet',
      Flags: '262144',
      LimitAmount: {
        currency: 'JAN',
        issuer: 'r589XuNWLyX4QP5JQtbP63QpP1ybXGRwZ',
        value: '10000'
      },
      Fee: 123,
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

  return (
    <>
      {userInfo.account && (
        <>
          {trust ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg">Balance: ¥ {trust} JAN</p>
              <p className="text-xl">Swap JAN to XAH with DEX</p>
              <Swap />
            </div>
          ) : (
            <>
              <div>No TrustLine</div>
              <button onMouseDown={Trust} className="m-4 btn btn-neutral btn-lg text-xl">
                ¥JAN Token setting
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
          )}
        </>
      )}
    </>
  );
};
