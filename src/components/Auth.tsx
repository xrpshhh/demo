"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Imagine } from "@/components/Imagine"
import { useUser } from "@/components/UserProvider"

export const Auth = () => {
    const { userInfo, xumm } = useUser();
    const router = useRouter();

    const [account, setAccount] = useState(userInfo.account || undefined);

    useEffect(() => {
        xumm.user.account.then(setAccount);
    }, [xumm.user]);

    const connect = async () => {
        try {
            await xumm.authorize();
            setAccount(await xumm.user.account);
            if (account) {
                router.push(`/${account}`);
            }
        } catch (error) {
            console.error("Error during connection:", error);
        }
    };

    const logout = async () => {
        try {
            await xumm.logout();
            setAccount(undefined);
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            {account ? (
                <div className="dropdown dropdown-end dropdown-hover">
                    <label tabIndex={0} className="btn btn-ghost btn-circle mx-2">
                        <Imagine priority={false} src={userInfo.picture ?? "https://cloudflare-ipfs.com/ipfs/bafybeidwkwodllbzo35ggin25uqvl2aoho6qlslmlvdey73ufy6dcaify4/avatar.png"} alt="Avatar" width={48} height={48} className="avatar" />
                    </label>
                    <ul tabIndex={0} className="p-2 z-[10] shadow menu menu-md dropdown-content bg-base-100 rounded-box w-auto bg-opacity-90">
                        <li>
                            <a onMouseDown={() => router.replace(`/${userInfo.account}`)}>
                                <button className="btn btn-xs hover:text-primary">
                                    Profile</button>
                                <span className="badge">Account</span>
                            </a>
                        </li>
                        <li>
                            <a onMouseDown={() => router.replace("/test")}>
                                <button className="btn btn-xs hover:text-primary">Set</button>
                                <span className="badge">Test</span>
                            </a>
                        </li>

                        <li>
                            <a onMouseDown={logout}>
                                <button className="btn btn-xs hover:text-primary" >Logout</button>
                                <span className="badge">bye...</span>
                            </a>
                        </li>
                    </ul>
                </div>
            ) : (
                <>
                    <button
                        className="btn btn-accent hover:text-primary mx-2"
                        onClick={connect}>
                        Connect
                    </button>
                </>
            )}
        </>
    );
};
