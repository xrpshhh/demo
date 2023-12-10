"use client"
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import { EditProfile } from "@/components/EditProfile";

export const runtime = 'edge';

export default function Profile() {
    const router = useRouter();
    const pathname = usePathname();
    const { userInfo } = useUser();

    if (!userInfo.account) {
        router.push("https://xrp.sh");
    }
    else if (pathname !== `https://xrp.sh/${userInfo.account}`) {
        router.replace(`https://xrp.sh/${userInfo.account}`);
    }
    return (<EditProfile />);
}
