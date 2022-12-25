
import React from "react"
import Link from "next/link"


const Header = () => {
    return (
        <div>
            <Link href="/" className="text-blue-400">Home</Link>
            <span> | </span>
            <Link href="/login" className="text-blue-400">Login</Link>
            <span> | </span>
            <Link href="/integrations-builder" className="text-blue-400">Integrations Builder</Link>
        </div>
    )
}

export default Header