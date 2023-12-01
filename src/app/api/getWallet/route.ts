import { NextRequest, NextResponse } from 'next/server';
import { Client, Wallet } from "xrpl";

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const seed = payload.seed;

  // const client = new Client("wss://testnet.xrpl-labs.com");
  const client = new Client("wss://xahau-test.net");
  await client.connect();

  // seedで自身のアカウントを取得
  const wallet = Wallet.fromSeed(seed);

  // 残高を取得
  const balance = await client.getXrpBalance(wallet.address);

  // 表示するウォレットのリスト
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

  await client.disconnect();
  // レスポンスでデータを返す
  return NextResponse.json({currentWallet, info});
}
