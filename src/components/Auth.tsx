"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Imagine } from "@/components/Imagine"
import { useUser } from "@/components/UserProvider"
import Link from "next/link";

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
            if (xumm.user) {
                setAccount(await xumm.user.account)
                // router.replace(`/${account}`);
                router.replace(`/${""}`);
            }
        } catch (error) {
            console.error("Error during connection:", error);
        }
    };

    const logout = async () => {
        try {
            await xumm.logout();
            setAccount(undefined);
            router.replace("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            {account ? (
                <div className="dropdown dropdown-end dropdown-hover">
                    <label tabIndex={0} className="btn btn-ghost btn-circle mx-2">
                        <Imagine priority={false} src={userInfo.picture ?? "/ipfs/avatar.png"} alt="Avatar" width={48} height={48} className="avatar" />
                    </label>
                    <ul tabIndex={0} className="p-2 z-[10] shadow menu menu-md dropdown-content bg-base-100 rounded-box w-auto bg-opacity-90">
                        <li>
                            <a onMouseDown={() => router.replace("/")}>
                                <button className="btn btn-xs hover:text-primary">
                                    Home
                                </button>
                                <span className="badge">🤫</span>
                            </a>
                        </li>
                        <li>
                            <a onMouseDown={() => router.push(`/${account}`)}>
                                <button className="btn btn-xs hover:text-primary">
                                    Profile
                                </button>
                                <span className="badge">🏴‍☠️</span>
                            </a>
                        </li>
                        <li>
                            <a onMouseDown={() => router.push("/test")}>
                                <button className="btn btn-xs hover:text-primary">Test</button>
                                <span className="badge">⚙️</span>
                            </a>
                        </li>
                        <li>
                            <Link
                                href="https://jumpy-profit-1d1.notion.site/XRP-Shhh-79c057110e824e36aa8bba035faf73dd?pvs=4" target="_blank" rel="noopener noreferrer">
                                <p className="btn btn-xs hover:text-primary">About</p>
                                <span className="badge">📚</span>
                            </Link>
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
                    <div className="dropdown dropdown-end dropdown-hover">
                        <label tabIndex={0} className="btn btn-ghost">
                            <Imagine
                                src={"/ipfs/xumm-icon.png"}
                                width={100}
                                height={58}
                                alt="sign"
                                onClick={connect}
                            />
                        </label>
                        <ul tabIndex={0} className="p-2 z-[10] shadow menu menu-md dropdown-content bg-base-100 rounded-box w-auto bg-opacity-90">
                            <li>
                                <a onMouseDown={() => router.replace("/")}>
                                    <button className="btn btn-xs hover:text-primary">
                                        Home</button>
                                </a>
                            </li>
                            <li>
                                <a onMouseDown={() => router.push("/test")}>
                                    <button className="btn btn-xs hover:text-primary">Test</button>
                                    <span className="badge">setting</span>
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="https://jumpy-profit-1d1.notion.site/XRP-Shhh-79c057110e824e36aa8bba035faf73dd?pvs=4" target="_blank" rel="noopener noreferrer">
                                    <p className="btn btn-xs hover:text-primary">About</p>
                                    <span className="badge">docs</span>
                                </Link>
                            </li>
                            <li>
                                <a onMouseDown={connect}>
                                    <button className="btn btn-xs hover:text-primary" >Connect</button>
                                    <span className="badge">hello</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </>
    );
};
