import { AccountSet } from "@/components/AccountSet";
import { Checks } from "@/components/Checks";
import { Payload } from "@/components/Payload";
import { Swap } from "@/components/Swap";

export default function App() {
  return (
    <>
      <div className='p-8 py-16 text-center container mx-auto'>
        <div className="p-4 m-4 card border border-primary">
          <Payload />
          <Checks />
          <Swap />
          <AccountSet />
        </div>
      </div>
    </>
  )
}
