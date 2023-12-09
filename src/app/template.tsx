import { Nav } from "@/components/Nav"

export default function template({ children, }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            {children}
        </>
    )
}
