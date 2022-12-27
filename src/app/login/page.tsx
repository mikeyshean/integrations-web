"use client"
import { useAuthContext } from "@/context/AuthContext"
import { useContext } from "react"


export default function LoginPage() {
    const { loginUser } = useAuthContext()

    return (
        <div className="text-blue-400">
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}