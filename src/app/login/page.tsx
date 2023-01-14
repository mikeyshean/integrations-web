"use client"
import { useAuthContext } from "@/context/AuthContext"
import Login from "screens/login/Login"

export default function LoginPage() {
  const { loginUser } = useAuthContext()

  return (
    <Login loginHandler={loginUser} />
  )
}