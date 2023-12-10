"use client"

import { Multisigh } from "@/components/Multisigh";
import { NFTTransfer } from "@/components/NFTTransfer";
import Link from "next/link";
import { ComponentProps, useEffect, useState } from "react";
import { Client, Wallet, xrpToDrops, Transaction } from "xrpl";

export default function Test() {
    const [wallet, setWallet] = useState<Wallet>();
    const [balance, setBalance] = useState("");
    const [raw, setRaw] = useState<string | undefined>(undefined);
    const [info, setInfo] = useState<string | undefined>(undefined);
    const [stats, setStats] = useState("Takes 3~5 sec to complete.");
    const [check, setCheck] = useState<any | undefined>(undefined);

    const ws = "wss://xahau-test.net"

    const client = new Client(ws as string);
    const shhh = "rQqqqqJyn6sKBzByJynmEK3psndQeoWdP"

    const createAccount = async () => {
        await client.connect();
        const faucet = await (await fetch('https://xahau-test.net/accounts', { method: 'POST' })).json()
        // console.log("faucet:", faucet)
        const wallet = Wallet.fromSeed(faucet.account.secret as string);

        const info: any = await client.request({
            command: "account_info",
            account: wallet.address,
        });
        await client.disconnect();
        setWallet(wallet)
        setInfo(JSON.stringify(info, null, 2))
        setBalance(faucet.balance)
    };

    const transfer: ComponentProps<"form">["onSubmit"] = async (event) => {
        event.preventDefault();
        const amount = event.currentTarget.amount.value;
        const destination = event.currentTarget.destination.value;

        await client.connect();

        const txForm: Transaction = await client.autofill({
            TransactionType: "Payment",
            Account: wallet?.address || "",
            Amount: xrpToDrops(amount as string),
            Destination: destination as string ? destination : shhh,
            Fee: "5000"
        });
        const tx = await client.submitAndWait(txForm, {
            autofill: true,
            wallet: wallet
        });

        let stats;
        if (tx.result.meta !== undefined && typeof tx.result.meta !== "string") {
            stats = tx.result.meta.TransactionResult as string
        }
        const info: any = await client.request({
            command: "account_info",
            account: wallet?.address,
        });
        const balance = await client.getXrpBalance(wallet?.address || "");
        await client.disconnect();
        setWallet(wallet)
        setBalance(balance)
        setStats(stats || "Error")
        setRaw(JSON.stringify(tx, null, 2))
        setInfo(JSON.stringify(info, null, 2))
        checklist()
    }

    const checklist = async () => {
        const client = new Client(ws as string)
        await client.connect()
        const info: any = await client.request({
            command: "account_objects",
            account: wallet?.address,
            type: "check"
        });
        await client.disconnect()

        let found = false;
        if (info.result.account_objects && info.result.account_objects.length > 0) {
            info.result.account_objects.forEach((checklist: any) => {
                if (checklist.Account === shhh) {
                    setCheck(checklist);
                    found = true;
                }
            });
            if (!found) {
                setCheck(undefined);
            }
        } else {
            setCheck(undefined);
        }
    }

    const CheckCash = async () => {
        await client.connect();

        const txForm: Transaction = await client.autofill({
            TransactionType: "CheckCash",
            Account: wallet?.address || "",
            Amount: check.SendMax,
            CheckID: check.index,
            Fee: "5000"
        });
        const tx = await client.submitAndWait(txForm, {
            autofill: true,
            wallet: wallet
        });

        let stats;
        if (tx.result.meta !== undefined && typeof tx.result.meta !== "string") {
            stats = tx.result.meta.TransactionResult as string
        }
        const info: any = await client.request({
            command: "account_info",
            account: wallet?.address,
        });
        const balance = await client.getXrpBalance(wallet?.address || "");
        await client.disconnect();
        setWallet(wallet)
        setBalance(balance)
        setStats(stats || "Error")
        setRaw(JSON.stringify(tx, null, 2))
        setInfo(JSON.stringify(info, null, 2))
        checklist()
    }
    return (
        <div className='pt-20 container mx-auto'>
            <div className='m-1 border-2 border-primary rounded-box'>
                <h1 className="mt-2 text-center text-info text-4xl">TEST</h1>
                {/* <Multisigh/> */}
                {/* <NFTTransfer /> */}
                <div className="container mx-auto">
                    {/* // アカウントを作成 /// */}
                    <div className="p-4 lg:w-4/5 md:w-full mx-auto">
                        <div className="card-bordered border-primary card p-4">
                            <h2 className="card-title text-xl sm:text-2xl">
                                Create Wallet
                            </h2>
                            <p className="mt-4">
                                Create a key pair for your account and get a test net balance.
                            </p>
                            <p className="text-xs">{ws}</p>
                            <button
                                onMouseDown={createAccount}
                                className="mt-4 btn btn-accent text-primary text-3xl">
                                GET
                            </button>
                        </div>
                    </div>
                    {wallet?.address && (<>
                        <div className="p-4 lg:w-4/5 md:w-full mx-auto">
                            <div className="card-bordered border-primary card p-4">
                                <h2 className="card-title mb-4 text-xl sm:text-2xl">
                                    Account Info
                                </h2>
                                <dl>
                                    <dt className="m-1 font-medium">address:</dt><dd className="truncate text-accent"> {wallet?.address}</dd>
                                    <dt className="m-1 font-medium">seed:</dt><dd className="truncate text-accent"> {wallet?.seed}</dd>
                                    <dt className="m-1 font-medium">publicKey:</dt><dd className="truncate text-accent"> {wallet?.publicKey}</dd>
                                    <dt className="m-1 font-medium">privateKey:</dt><dd className="truncate text-accent"> {wallet?.privateKey}</dd>
                                    <dt className="m-1 font-medium">balance:</dt><dd className="text-accent"> {balance}</dd>
                                </dl>
                                <details className="mt-4 collapse collapse-arrow border border-base-300 bg-base-100">
                                    <summary className="collapse-title text-xl text-secondary font-medium">
                                        Info
                                    </summary>
                                    <div className="collapse-content">
                                        <pre className="text-success text-xs overflow-scroll">{info}</pre>
                                    </div>
                                </details>
                                <Link href={`https://explorer.xahau-test.net/${wallet.address}/objects`} target="_blank" rel="noopener noreferrer">
                                    <button className="my-2 btn btn-accent text-primary text-3xl w-full ">Explorer</button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 lg:w-4/5 md:w-full mx-auto">
                            <div className="card-bordered border-primary card p-4">
                                <h2 className="card-title mb-4 text-xl sm:text-2xl">
                                    Send XRP
                                </h2>
                                <form onSubmit={transfer}>
                                    <div>
                                        <label htmlFor="destination">Destination Addres</label>
                                        <input
                                            type="text"
                                            name="destination"
                                            id="destination"
                                            className="w-full input input-bordered"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="amount">XRP Amount</label>
                                        <input
                                            type="text"
                                            name="amount"
                                            defaultValue={2}
                                            id="amount"
                                            className="w-full input input-bordered"
                                        />
                                    </div>
                                    <button
                                        className="mt-4 btn btn-accent text-primary text-3xl w-full">
                                        Send
                                    </button>
                                </form>
                                {check && (<>
                                    {JSON.stringify(check?.SendMax)}
                                    {JSON.stringify(check?.index)}
                                    <button
                                        onMouseDown={CheckCash}
                                        className="mt-4 btn btn-accent text-primary text-3xl w-full">
                                        CheckCash
                                    </button>
                                </>)}
                                <details className="mt-4 collapse collapse-arrow border border-base-300 bg-base-100">
                                    <summary className="collapse-title text-xl text-secondary font-medium">
                                        {stats}
                                    </summary>
                                    <div className="collapse-content">
                                        <pre className="text-success text-xs overflow-scroll">{raw}</pre>
                                    </div>
                                </details>
                                <Link href={`https://explorer.xahau-test.net/${shhh}/tx`} target="_blank" rel="noopener noreferrer">
                                    <button className="my-2 btn btn-accent text-primary text-3xl w-full ">HooksTx</button>
                                </Link>
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
        </div>
    );
}
