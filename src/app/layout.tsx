import '@/styles/globals.css'
import { Silkscreen } from "next/font/google"

import { UserProvider } from '@/components/UserProvider'
import { Meta } from './Meta'

export const metadata = Meta

const fonts = Silkscreen({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fonts.className}>
        <UserProvider>
            {children}
        </UserProvider>
      </body>
    </html>
  )
}
