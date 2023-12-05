"use client"
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import { EditProfile } from "@/components/EditProfile";

export const runtime = 'edge';
const origin = process.env.ORIGIN

export default function Profile() {
    const router = useRouter();
    const pathname = usePathname();

    const { userInfo } = useUser();

    //ログインしている場合は/アカウント名のパスでプロフィール画面を表示する
    if (userInfo.account && `/${userInfo.account}` !== pathname) {
        router.push(`${origin}/${userInfo.account}`);
    }

    return (
        <>
            {userInfo.account ? (
                <EditProfile />
            ) : (
                <>{router.push(`${origin}/`)}</>
            )}
        </>
    )
}
