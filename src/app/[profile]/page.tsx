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

    if (!userInfo.account) {
        router.push(`${origin}`);
    }
    else if (pathname !== `/${userInfo.account}`) {
        router.replace(`${origin}/${userInfo.account}`);
    }
    return (<EditProfile />);
}
