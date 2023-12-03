import { AddressCheck } from "@/components/AddressCheck";
import { Payload } from "@/components/Payload";

export default function App() {
  return (
    <>
      <div className='p-8 py-16 text-center container mx-auto'>
        <div className="p-4 m-4 card border border-primary">
          {/* <AddressCheck /> */}
          <Payload />
        </div>
      </div>
    </>
  )
}
