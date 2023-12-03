"use client"

import { Test } from '@/components/Test';
import { useEffect, useState } from 'react';
import { Client, Wallet, xrpToDrops, Transaction } from 'xrpl';

export default function Tests() {
    const [aliceWallet, setAliceWallet] = useState<Wallet | null>(null);
    const [aliceBalance, setAliceBalance] = useState<number>(0);
    const [aliceAmount, setAliceAmount] = useState<string>('123');
    const [bobWallet, setBobWallet] = useState<Wallet | null>(null);
    const [bobBalance, setBobBalance] = useState<number>(0);
    const [bobAmount, setBobAmount] = useState<string>('321');
    const [status, setStatus] = useState<string>('Wallet funding...');
    const [info, setInfo] = useState();
    
    const [client] =useState(new Client('wss://testnet.xrpl-labs.com'));

    useEffect(() => {
        setup();
    }, []);

    const setup = async () => {
        await client.connect();
        const alice = await client.fundWallet();
        const bob = await client.fundWallet();
        setAliceWallet(alice.wallet);
        setAliceBalance(alice.balance);
        setBobWallet(bob.wallet);
        setBobBalance(bob.balance);
        setStatus('Wallets funded.');
    };

    const sendPayment = async (fromWallet: Wallet, toWallet: Wallet, amount: string) => {
        setStatus(`Sending ${amount} XRP from ${fromWallet?.address} to ${toWallet?.address}`);
        const tx: Transaction = {
            TransactionType: 'Payment',
            Account: fromWallet?.address || '',
            Amount: xrpToDrops(amount),
            Destination: toWallet?.address || '',
        };
        const result: any = await client.submitAndWait(tx, {
            autofill: true,
            wallet: fromWallet,
        });
        if (result.result.meta?.TransactionResult === 'tesSUCCESS') {
            setStatus(`Successfully sent ${amount} XRP`);
            const newAliceBalance = await client.getXrpBalance(aliceWallet?.address || '');
            const newBobBalance = await client.getXrpBalance(bobWallet?.address || '');
            setAliceBalance(parseFloat(newAliceBalance));
            setBobBalance(parseFloat(newBobBalance));
            // アカウントの現在の情報を取得
            const account_info: any = await client.request({
                command: "account_info",
                account: fromWallet?.address
            })
            setInfo(account_info.result.account_data.PreviousTxnID);
        } else {
            setStatus('Transaction failed.');
            // await client.disconnect();
        }
    };
    return (
        <div className='p-4 py-20 container mx-auto'>
            <div className='p-4 border border-primary rounded-box'>
                <h1 className="mb-4 text-center text-info text-4xl">TEST</h1>
                <h2 className="mt-2 text-center text-2xl">{status}</h2>
                <div className="p-2 flex flex-col lg:flex-row lg:justify-center">
                    <div className='mt-2 mx-2 p-2 border border-accent rounded-box w-auto lg:w-[45%]'>
                        <h2>Alice</h2>
                        <p className="truncate text-accent">Address: {aliceWallet?.address}</p>
                        <p className="truncate text-accent">Seed: {aliceWallet?.seed}</p>
                        <p className="truncate text-accent">Balance: {aliceBalance} XRP</p>
                        <div className="mt-2 flex">
                            <input
                                className="flex-grow input input-sm input-bordered"
                                value={aliceAmount}
                                onChange={(e) => setAliceAmount(e.target.value)}
                            />
                            <button className="btn btn-sm ml-2" onClick={() => sendPayment(aliceWallet!, bobWallet!, aliceAmount)}>Send</button>
                        </div>
                    </div>
                    <div className='mt-2 mx-2 p-2 border border-accent rounded-box w-auto lg:w-[45%]'>
                        <h2>Bob</h2>
                        <p className="truncate text-accent">Address: {bobWallet?.address}</p>
                        <p className="truncate text-accent">Seed: {bobWallet?.seed}</p>
                        <p className="truncate text-accent">Balance: {bobBalance} XRP</p>
                        <div className="mt-2 flex">
                            <input
                                className="flex-grow input input-sm input-bordered"
                                value={bobAmount}
                                onChange={(e) => setBobAmount(e.target.value)}
                            />
                            <button className="btn btn-sm ml-2" onClick={() => sendPayment(bobWallet!, aliceWallet!, bobAmount)}>Send</button>
                        </div>
                    </div>
                </div>
                {info && (
                    <pre className="m-2 truncate text-accent">
                        TxnID: {JSON.stringify(info, null, 2)}
                    </pre>
                )}

                <Test />

            </div>
        </div>
    );
}
