"use client"
import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie, removeCookie } from 'typescript-cookie'
import { JWT_KEY } from '../constants'

const API_HOST = process.env.API_HOST

type AuthData = {
  loginUser: (username: string, password: string) => {},
  logoutUser: () => void,
}

const AuthContext = createContext({} as AuthData);

function useAuthContext() {
  return useContext(AuthContext)
}

function AuthProvider({children}: {children: React.ReactNode}) {
  const router = useRouter()

  async function loginUser(username: string, password: string) {
    const response = await fetch(`${API_HOST}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'username': username, 
        'password': password
      })
    })
    const data: {refresh: string, access: string } = await response.json()
      
    if (response.status === 200) {
      setCookie(JWT_KEY, JSON.stringify(data), { expires: 7 })
      router.push("/mapper")
    } else {
      alert('Oops.. Something went wrong..')
    }
  }

  function logoutUser() {
    removeCookie(JWT_KEY)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider }