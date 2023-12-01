import { NextResponse } from "next/server";
import { Client, Wallet } from "xrpl";

// export const runtime = 'edge';

export async function GET() {
  // XRP Ledger Test Net に接続
  // const client = new Client("wss://testnet.xrpl-labs.com");
  const client = new Client("wss://xahau-test.net");
  await client.connect();
  const faucet = await (await fetch('https://xahau-test.net/accounts', { method: 'POST' })).json()
  // console.log(faucet)
  // 新しいウォレットを作成
  // const wallet = (await client.fundWallet()).wallet;
  // const wallet = Wallet.generate();
  const wallet = Wallet.fromSeed(await faucet.account.secret);
  // 残高を取得
  const balance = await client.getXrpBalance(wallet.address);

  // 表示するウォレットのデータを定義
  const newWallet = {
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
    seed: wallet.seed,
    balance,
  };

  const info = await client.request({
      command: "account_info",
      account: wallet.address,
  });

  // console.log(
  //   await client.request({
  //     command: "account_nfts",
  //     account: wallet.address,
  //   })
  // );

  // XRP Ledger Test Net との接続を解除
  await client.disconnect();

  // レスポンスでデータを返す
  return NextResponse.json({newWallet, info});
}
