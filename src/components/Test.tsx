"use client"

import { useState } from "react";
import { getWallet, createAccount, transfer } from "./Action";

interface Wallet {
    address: string;
    publicKey: string;
    privateKey: string;
    seed: string;
    balance: string;
};

export const Test = () => {
    const initialWallet = {
        address: "",
        publicKey: "",
        privateKey: "",
        seed: "",
        balance: "",
    };

    const [Wallet, setWallet] = useState<Wallet>(initialWallet);
    const [stats, setStats] = useState("Takes 3~5 sec to complete.");
    const [raw, setRaw] = useState<string | undefined>(undefined);
    const [info, setInfo] = useState<string | undefined>(undefined);

    return (
        <>
            <div className="container mx-auto p-4">
                {/* // アカウントを作成 /// */}
                <div className="p-4 lg:w-2/3 md:w-full mx-auto">
                    <div className="card-bordered border-primary card p-4">
                        <h2 className="card-title text-xl sm:text-2xl">
                            Create Wallet
                        </h2>
                        <p className="mt-4">
                            Create a key pair for your account and get a test net balance.
                        </p>
                        <form
                            action={async () => {
                                const data = await createAccount()
                                setWallet(data.newWallet);
                                setInfo(JSON.stringify(data.info, null, 2))
                            }}
                        >
                            <button className="mt-4 btn btn-accent">Create</button>
                        </form>
                    </div>
                </div>
                {/* シードから作成 */}
                <div className="p-4 lg:w-2/3 md:w-full mx-auto">
                    <div className="card-bordered border-primary card p-4">
                        <h2 className="card-title text-xl sm:text-2xl">
                        Seed to account (seed is secret)
                        </h2>
                        <p className="mt-4">
                            Get an existing account (r...) by entering seed.(s...)
                        </p>
                        <form
                            action={async (formData) => {
                                const data = await getWallet(formData)
                                setWallet(data.currentWallet);
                                setInfo(JSON.stringify(data.info, null, 2))
                            }}
                            className="mt-4">
                            <label htmlFor="seed">seed</label>
                            <input
                                type="text"
                                name="seed"
                                id="seed"
                                className="w-full input input-bordered bg-white text-base-100"
                            />
                            <button className="mt-4 btn btn-accent">get</button>
                        </form>
                    </div>
                </div>

                {Wallet.address && (<>
                    <div className="p-4 lg:w-2/3 md:w-full mx-auto">
                        <div className="card-bordered border-primary card p-4">
                            <h2 className="card-title mb-4 text-xl sm:text-2xl">
                                Account Info
                            </h2>
                            <dl>
                                {Object.entries(Wallet).map(([key, value]) => (
                                    <>
                                        <dt className="m-1 font-medium">{key}:</dt>
                                        <dd className="truncate text-accent">{value}</dd>
                                    </>
                                ))}
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
                            <form action={async (formData) => {
                                const data = await transfer(formData,);
                                setWallet({ ...Wallet, balance: data.balance });
                                setStats(data.stats);
                                setRaw(JSON.stringify(data.tx, null, 2));
                            }}>
                                <div>
                                    <label htmlFor="seed">seed</label>
                                    <input
                                        type="text"
                                        name="seed"
                                        id="seed"
                                        value={Wallet.seed}
                                        className="w-full input input-bordered bg-white text-base-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="destination">Destination Address(r...)</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        id="destination"
                                        className="w-full input input-bordered bg-white text-base-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="amount">XRP Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="w-full input input-bordered bg-white text-base-100"
                                    />
                                </div>
                                <button className="mt-4 btn btn-accent">Send</button>
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
        </>
    )
}
