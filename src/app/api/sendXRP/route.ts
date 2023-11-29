import { NextRequest, NextResponse } from "next/server";
import { Client, Wallet, xrpToDrops, getBalanceChanges, Transaction } from "xrpl";

// export const runtime = 'edge';

type txData = {
  seed: string;
  amount: number;
  destination: string;
};

export async function POST(req: NextRequest) {
  // 受け取った値を定義
  const txData: txData = await req.json();;

  // XRP Ledger Test Net に接続
  const client = new Client("wss://testnet.xrpl-labs.com");
  await client.connect();

  // seedで自身のアカウントを取得
  const wallet = Wallet.fromSeed(txData.seed);

  // トランザクションを準備
  const txForm: Transaction = await client.autofill({
    TransactionType: "Payment",
    Account: wallet.address, // 送金するの自身のウォレットアドレス
    Amount: xrpToDrops(txData.amount), // 送金金額
    Destination: txData.destination, // 送信先のウォレットアドレス
  });

  // 準備されたトランザクションに署名。
  const signed = wallet.sign(txForm);

  //トランザクションを送信し、結果を待ちます。
  const tx = await client.submitAndWait(signed.tx_blob);
  // console.log(tx)

  // トランザクションによって生じた変更を取得
  let changeData;
  let stats;
  if (tx.result.meta !== undefined && typeof tx.result.meta !== "string") {
    changeData = JSON.stringify(getBalanceChanges(tx.result.meta), null, 2);
    stats = tx.result.meta.TransactionResult
  }

  // 送金後残高
  const balance = await client.getXrpBalance(wallet.address);

  // XRP Ledger Test Net との接続を解除
  await client.disconnect();
  // レスポンスでデータを返す
  return NextResponse.json({ balance, changeData, stats, tx });
};
