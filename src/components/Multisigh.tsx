"use client"

import { Client, Wallet } from "xrpl";
import { sign, deriveKeypair } from 'xrpl-sign-keypairs';
import React, { useState } from 'react';
import { useUser } from "@/components/UserProvider";

// トランザクションを処理する非同期関数
export const Multisigh = () => {
  const [result, setResult] = useState("");
  const { userInfo } = useUser();

  const processTransaction = async () => {

      if (!userInfo?.account) {
        console.error('受信者アドレスが未設定です');
        setResult('受信者アドレスが未設定です。');
        return;
      }
  const wallet = Wallet.fromSeed("sEd7Pi2eypYE5owiH7vD38FX7ALKZSd");
  const client = new Client("wss://s.altnet.rippletest.net:51233");

  await client.connect();

  await client.submitAndWait({
    TransactionType: "SignerListSet",
    Account: wallet.classicAddress,
    SignerEntries: [
      {
        SignerEntry: {
          Account: 'rKjU1h8eKNv53ZnuGhVPX8T4GGBgoUmjj4',
          SignerWeight: 1,
        },
      },
      {
        SignerEntry: {
          Account: 'rUasRGvHhr5AzaGVTdJaUtGU1r8vxQAuRU',
          SignerWeight: 1,
        },
      },
      {
        SignerEntry: {
          Account: 'rn9PWWoUmv3wzdR546eKXE45ceWT6ZXzft',
          SignerWeight: 1,
        },
      },
    ],
    SignerQuorum: 2,
  }, { wallet });

  await client.submitAndWait({
    TransactionType: "AccountSet",
    Account: wallet.classicAddress,
    SetFlag: 4,
  }, { wallet });

  const accountInfo = await client.request({
    command: "account_info",
    account: wallet.classicAddress,
  });

  const sequence = accountInfo.result.account_data.Sequence;

  const txJson = {
    TransactionType: "Payment",
    Destination: userInfo.account,
    Amount: "100",
    Account: wallet.classicAddress,
    Sequence: sequence,
    Fee: "100",
  };

  const signerWalletA = Wallet.fromSeed("sEdVkxWPmae9QDV8yd2aSbyPPQTAwJ6");
  const signedTxByA = sign(txJson, deriveKeypair(signerWalletA.seed), {
    signAs: signerWalletA.classicAddress,
  });

  const signerWalletB = Wallet.fromSeed("sEdSyyNeCQV9TCA2MLgwUYB3jbFxUAU");
  const signedTxByB = sign(signedTxByA.txJson, deriveKeypair(signerWalletB.seed), {
    signAs: signerWalletB.classicAddress,
  });

  await client.request({
    command: "submit_multisigned",
    tx_json: signedTxByB.txJson,
  });
}

return (
  <div className="App text-center">
    <h1 className="text-3xl font-bold my-6">Multi Signature</h1>
    <div>
        <button className="mt-4 btn btn-accent" onClick={processTransaction}>Execute Transaction</button>
        <p>{result}</p>
    </div>
  </div>
  );
}
