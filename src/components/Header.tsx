
import React, { useContext } from "react"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"

const Header = () => {
    const { isUserAuthenticated, authState } = useAuthContext()
    return (
        <div>
            <Link href="/" className="text-blue-400">Home</Link>
            <span> | </span>
            {isUserAuthenticated() ? (
                <p>Logout</p>
            ) : (
                <Link href="/login" className="text-blue-400">Login</Link>
            )}
            <span> | </span>
            <Link href="/integrations-builder" className="text-blue-400">Integrations Builder</Link>
            {
                isUserAuthenticated() && <p>Hello {authState.first_name}</p>
            }
            
        </div>
    )
}

export default Header