import { NextRequest, NextResponse } from 'next/server';
import { Client, Wallet } from "xrpl";

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const seed = payload.seed;

  // XRP Ledger Test Net に接続
  const client = new Client("wss://testnet.xrpl-labs.com");
  await client.connect();

  // seedで自身のアカウントを取得
  const wallet = Wallet.fromSeed(seed);

  // 残高を取得
  const balance = await client.getXrpBalance(wallet.address);

  // 表示するウォレットのデータを定義
  const currentWallet = {
    address: wallet.address,
    seed: seed,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
    balance,
  };

  const info = await client.request({
    command: "account_info",
    account: wallet.address,
  });

  // XRP Ledger Test Net との接続を解除
  await client.disconnect();

  // レスポンスでデータを返す
  return NextResponse.json({currentWallet, info});
}
