"use client"

import Link from "next/link"
import { Imagine } from "./Imagine"
import { Auth } from "./Auth"
import { Theme } from './Theme'

export const Nav = () => {
    // const ipfs = '/ipfs'
    // const ipfs = "https://ipfs.io/ipfs/bafybeidwkwodllbzo35ggin25uqvl2aoho6qlslmlvdey73ufy6dcaify4";
    const ipfs = "https://cloudflare-ipfs.com/ipfs/bafybeidwkwodllbzo35ggin25uqvl2aoho6qlslmlvdey73ufy6dcaify4";
    return (
        <header className="drawer z-10 text-accent bg-base-100 bg-opacity-80 block absolute shadow-xl border-b-neutral">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            {/* サイドーバー */}
            <nav className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay "></label>
                <ul className="menu p-2 w-auto max-w-xs text-center text-lg h-full bg-base-100">
                    <li>
                        <form className="form-control">
                            <div className="join">
                                <input className="input input-bordered join-item w-24" placeholder="Search" />
                                <button className="btn join-item btn-neutral">🔍</button>
                            </div>
                        </form>
                    </li>
                    <li><Link href="/" className="[transition:0.3s] text-lg hover:text-primary">Home</Link></li>
                    <li><Link href="/" className="[transition:0.3s] text-lg hover:text-primary">About</Link></li>
                    <li><Link href="/" className="[transition:0.3s] text-lg hover:text-primary">Docs</Link></li>
                    <li><Link href="/" className="[transition:0.3s] text-lg hover:text-primary">Contact</Link></li>
                    <li><Link href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
                        <Imagine src={`${ipfs}/youtube.png`} priority width={40} height={40} alt="youtube" />
                    </Link></li>
                    <li><Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                        <Imagine src={`${ipfs}/twitter.png`} priority width={40} height={40} alt="twitter" />
                    </Link></li>
                    <li><Link href="https://github.com/" target="_blank" rel="noopener noreferrer">
                        <Imagine src={`${ipfs}/github.png`} priority width={40} height={40} alt="github" />
                    </Link></li>
                </ul>
            </nav>
            <nav className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar">

                    <div className="navbar-start">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-10 h-10 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                        <Link href={'/'}>
                            <Imagine src={`${ipfs}/logo.png`} width={48} height={48} alt="logo" />
                        </Link>
                        <h1 className="text-accent font-bold text-xl">
                            XRP☝Shhh
                        </h1>
                    </div>
                    {/* <div className="navbar-center md:hidden">
                        </div> */}
                    <div className="navbar-end">
                        {/* テーマアイコンとサイインイン */}
                        <Theme />
                        <Auth />
                    </div>
                </div>
                {/* body */}
            </nav>
        </header>
    )
}
