// import { AccountSet } from "@/components/AccountSet";
import { Checks } from "@/components/Checks";
// import { Issue } from "@/components/Issue";
import { Ledger } from "@/components/Ledger";
import { Payload } from "@/components/Payload";
// import { Swap } from "@/components/Swap";
import { TrustSet } from "@/components/TrustSet";
import { Xaman } from "@/components/Xaman";

export default function App() {
  return (
    <div className='p-4 py-20 text-center container mx-auto'>
      <div className="p-3 card border border-primary rounded-box">
        <Ledger />
        <Xaman />
        <Payload />
        <Checks />
        <TrustSet />
        {/* <Issue /> */}
        {/* <Swap /> */}
        {/* <AccountSet /> */}
      </div>
    </div>
  )
}
