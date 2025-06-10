import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { isAuthenticated } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"
import { Analytics } from '@vercel/analytics/next';

export const RootLayout = async ({children} : {children : ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();

    if(!isUserAuthenticated) {
        redirect("/signin");
    }

    return (
        <div className="root-layout">
            <nav> 
                <Link href={"/"} className="flex items-center gap-2">
                <Image src="/logo.svg" width={38} height={32} alt="logo" />
                <h2 className="text-primary-100">
                    Heyllo.ai
                </h2>
                </Link>
            </nav>
            {children}
            <Analytics /> {/*for Vercel Analytics */}
        </div>
    )
}

export default RootLayout ;