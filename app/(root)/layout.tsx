// RootLayout.tsx
import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { isAuthenticated } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"
import { Analytics } from '@vercel/analytics/next'
import { LogoutButton } from "@/components/LogOutButton"

export const RootLayout = async ({children}: {children: ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();

    if(!isUserAuthenticated) {
        redirect("/signin");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-blue-50/30">
            <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/30 sticky top-0 z-10 shadow-sm shadow-indigo-100/30">
                <Link href={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image 
                        src="/logo.png" 
                        width={60} 
                        height={50} 
                        alt="logo" 
                        className="w-auto drop-shadow-sm"
                    />
                    <h2 className="text-2xl font-light text-gray-800">
                        <span className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Heyllo</span>
                        <span className="text-gray-600">.ai</span>
                    </h2>
                </Link>
                <LogoutButton />
            </nav>

            <main className="p-6">
                {children}
            </main>

            <Analytics />
        </div>
    )
}

export default RootLayout