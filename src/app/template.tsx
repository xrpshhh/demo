import { Nav } from "@/components/Nav"
import { Bnav } from "@/components/Bnav"

export default function template({ children, }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            {children}
            {/* <Bnav /> */}
        </>
    )
}
