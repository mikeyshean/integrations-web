"use client"
import React, { createContext, useState, useEffect, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { setCookie, removeCookie, getCookie } from 'typescript-cookie'

const API_HOST = process.env.API_HOST
const JWT_KEY = "mapper-jwt"

type LoginEvent = {
  email: { value: string },
  password: { value: string }
}

type AuthUser = {
  token_type: string,
  exp: number,
  iat: number,
  jti: string,
  user_id: number,
  first_name: string
}

type Token = {
  refresh: string,
  access: string
}

type TokenWithName = {
  token?: Token,
  first_name: string
}
type AuthData = {
  loginUser: (e: React.SyntheticEvent<Element, Event>) => {},
  logoutUser: () => void,
  authToken?: TokenWithName,
  isUserAuthenticated: () => boolean
}

const AuthContext = createContext({} as AuthData);

function useAuthContext() {
  return useContext(AuthContext)
}

function AuthProvider({children}: {children: React.ReactNode}) {

  const [authToken, setAuthToken] = useState<TokenWithName>()
  const router = useRouter()

  const isUserAuthenticated = () => {
    return !!authToken?.token
  }

  async function loginUser(e: React.SyntheticEvent<Element, Event>) {
    e.preventDefault()
    const target = e.target as unknown as LoginEvent
    const response = await fetch(`${API_HOST}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'username': target.email.value, 
          'password': target.password.value
        })
    })
    const data: {refresh: string, access: string } = await response.json()
      
    if (response.status === 200) {
      const user = jwt_decode(data.access) as AuthUser
      setAuthToken({token: data, first_name: user.first_name})
      setCookie(JWT_KEY, JSON.stringify(data), { expires: 7 })
      router.push("/mapper")
    } else {
      alert('Something went wrong!')
    }
  }

  function logoutUser() {
    removeCookie(JWT_KEY)
    router.push("/login")
  }

  useEffect(() => {
    const storedToken = getCookie(JWT_KEY) ?  JSON.parse(getCookie(JWT_KEY) as string) : ''
    const firstName = storedToken ? (jwt_decode(storedToken.access) as AuthUser).first_name : ''
    if (storedToken) {
        setAuthToken({token: storedToken, first_name: firstName})
    }
  },[])

  return (
    <AuthContext.Provider
      value={{
        authToken: authToken,
        isUserAuthenticated,
        loginUser: loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContext, AuthProvider }