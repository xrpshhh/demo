"use client"

import { ComponentProps, useState } from "react";
import { Client, Wallet, xrpToDrops, Transaction } from "xrpl";

export default function Test() {
    const [wallet, setWallet] = useState<Wallet>();
    const [balance, setBalance] = useState("");
    const [raw, setRaw] = useState<string | undefined>(undefined);
    const [info, setInfo] = useState<string | undefined>(undefined);
    const [stats, setStats] = useState("Takes 3~5 sec to complete.");

    const ws = process.env.WS_URI
    const client = new Client(ws as string);

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
            Destination: destination as string,
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
    }
    return (
        <div className='p-4 py-20 container mx-auto'>
            <div className='p-3 border border-primary rounded-box'>
                <h1 className="text-center text-info text-3xl">TEST</h1>

                <div className="container mx-auto p-3">
                    {/* // アカウントを作成 /// */}
                    <div className="p-4 lg:w-2/3 md:w-full mx-auto">
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
                        <div className="p-4 lg:w-2/3 md:w-full mx-auto">
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
                            </div>
                        </div>

                        <div className="p-4 lg:w-2/3 md:w-full mx-auto">
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
                                            className="w-full input input-bordered bg-white text-base-300"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="amount">XRP Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            id="amount"
                                            className="w-full input input-bordered bg-white text-base-300"
                                        />
                                    </div>
                                    <button
                                    className="mt-4 btn btn-accent text-primary text-3xl w-full ">
                                        Send
                                        </button>
                                </form>

                                <details className="mt-4 collapse collapse-arrow border border-base-300 bg-base-100">
                                    <summary className="collapse-title text-xl text-secondary font-medium">
                                        {stats}
                                    </summary>
                                    <div className="collapse-content">
                                        <pre className="text-success text-xs overflow-scroll">{raw}</pre>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
        </div>
    );
}
