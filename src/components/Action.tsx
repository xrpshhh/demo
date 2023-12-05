"use server"

import { Client, Wallet, xrpToDrops, getBalanceChanges, Transaction } from "xrpl";

const ws = process.env.WS_URI
const client = new Client(ws as string);

export async function createAccount() {
    await client.connect();
    // 新しいウォレットを作成
    // const wallet = (await client.fundWallet()).wallet;
    const faucet = await (await fetch('https://xahau-test.net/accounts', { method: 'POST' })).json()
    console.log("faucet:", faucet)
    const wallet = Wallet.fromSeed(faucet.account.secret as string);

    // 表示するウォレットのデータ
    const newWallet = {
      address: wallet.classicAddress,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      seed: wallet.seed,
      balance: faucet.balance,
    };

    const info = await client.request({
        command: "account_info",
        account: wallet.classicAddress,
    });
    // XRP Ledger Test Net との接続を解除
    await client.disconnect();

    // レスポンスでデータを返す
    return ({newWallet, info});
};

export async function getWallet(formData: FormData) {
    const seed = formData.get("seed")
    await client.connect();
    // seedで自身のアカウントを取得
    const wallet = Wallet.fromSeed(seed as string);

    // 残高を取得
    const balance = await client.getXrpBalance(wallet.address);

    // 表示するウォレットのデータ
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
    return ({ currentWallet, info });
};

export async function transfer(formData: FormData) {
    const seed = formData.get("seed")
    const amount = formData.get("amount");
    const destination = formData.get("destination");
    // XRP Ledger Test Net に接続
    await client.connect();

    // seedで自身のアカウントを取得
    const wallet = Wallet.fromSeed(seed as string);

    // トランザクションを準備
    const txForm: Transaction = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.address, // 送金するの自身のウォレットアドレス
        Amount: xrpToDrops(amount as string), // 送金金額
        Destination: destination as string, // 送信先のウォレットアドレス
    });

    // 準備されたトランザクションに署名。
    const signed = wallet.sign(txForm);

    //トランザクションを送信し、結果を待ちます。
    const tx = await client.submitAndWait(signed.tx_blob);

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
    return ({ balance, changeData, stats, tx });
}
