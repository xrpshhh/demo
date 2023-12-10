"use client"

import { Imagine } from "./Imagine"
import { Auth } from "./Auth"
import { Theme } from './Theme'
import { useRouter } from 'next/navigation';

export const Nav = () => {
    const router = useRouter();
    return (
        <header className="drawer z-10 text-accent bg-base-100 bg-opacity-80 block absolute shadow-md border-b-neutral">
            <nav className="drawer-content flex flex-col">
                <div className="navbar">

                    <div className="navbar-start">
                        <a onMouseDown={() => router.replace("/")}>
                            <Imagine src={"/public/logo.png"} width={48} height={48} alt="logo" />
                            </a>
                        <h1 className="text-accent font-bold text-xl">
                            XRP🤫Shhh
                        </h1>
                    </div>

                    <div className="navbar-end">
                        {/* テーマアイコンとサイインイン */}
                        <Theme />
                        <Auth />
                    </div>

                </div>
            </nav>
        </header>
    )
}
