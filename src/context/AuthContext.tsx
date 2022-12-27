"use client"
import React, { createContext, useState, useEffect, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'next/navigation'

const API_HOST = process.env.API_HOST

type LoginEvent = {
    username: { value: string },
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

// type AuthData = {
//     loginUser: (e: React.SyntheticEvent<Element, Event>) => {},
//     user: AuthUser | undefined
// }

type Token = {
    token: string,
    first_name: string
}
type AuthData = {
    loginUser: (e: React.SyntheticEvent<Element, Event>) => {},
    authState: Token,
    setAuthState: (token: string) => void,
    isUserAuthenticated: () => boolean
    
}


// const AuthContext = createContext({loginUser: (e: React.SyntheticEvent<Element, Event>) => {}, user: undefined} as AuthData);


const AuthContext = React.createContext({} as AuthData);

function useAuthContext() {
    return useContext(AuthContext)
}


function AuthProvider({children}: {children: React.ReactNode}) {

    const [authState, setAuthState] = useState({token: '', first_name: ''})
    const router = useRouter()

    const setUserAuthInfo = (token: string) => {
        localStorage.setItem("token", token)
        
        setAuthState({
            token: token ? token : '',
            first_name: ''
        });
    };

    const isUserAuthenticated = () => !!authState.token

    async function loginUser(e: React.SyntheticEvent<Element, Event>) {
        e.preventDefault()
        console.log("logging in")
        const target = e.target as unknown as LoginEvent
        const response = await fetch(`${API_HOST}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': target.username.value, 
                'password': target.password.value
            })
        })
        const data = await response.json()
        
        if (response.status === 200) {
            console.log("login successful.. redirecting to /")
            const user = jwt_decode(data.access) as AuthUser
            setAuthState({token: data, first_name: user.first_name})
            localStorage.setItem('authTokens', JSON.stringify(data))
            router.push("/")
        } else {
            alert('Something went wrong!')
        }
    }

    useEffect(() => {
        console.log("AuthProvider useEffect")
        const storedTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') as string) : ''
        const firstName = storedTokens ? (jwt_decode(storedTokens.access) as AuthUser).first_name : ''
        if (storedTokens) {
            console.log(`setAuthState with ${storedTokens}`)
            setAuthState({token: storedTokens, first_name: firstName})
        }

    },[])

    return (
        <AuthContext.Provider
          value={{
            authState,
            setAuthState: (token: string) => setUserAuthInfo(token),
            isUserAuthenticated,
            loginUser: loginUser
          }}
        >
         {children}
        </AuthContext.Provider>
    );
};

const PrivateRoute = ({ children }: any) => {
    const router = useRouter();
    const { isUserAuthenticated } = useContext(AuthContext);

    const isLoggedIn = isUserAuthenticated();

    useEffect(() => {
        console.log("protected route use effect")
        // This could come from a refresh... we should check localStorage for valid token
        if (!isLoggedIn) {
            console.log("redirecting from protected route... /login")
            router.push("/login")
        }
    })
    

    return (
        <>
            {children}
        </>
    )
};



    
    // const [authTokens, setAuthTokens] = useState(storedTokens ? JSON.parse(storedTokens) : null)
    // const [user, setUser] = useState(storedUser as AuthUser)
    // const router = useRouter()

    // async function loginUser(e: React.SyntheticEvent<Element, Event>) {
    //     e.preventDefault()
    //     console.log("logging in")
    //     const target = e.target as unknown as LoginEvent
    //     const response = await fetch('http://localhost:8000/api/token/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             'username': target.username.value, 
    //             'password': target.password.value
    //         })
    //     })
    //     const data = await response.json()
        
    //     if (response.status === 200) {
    //         console.log("login successful")
    //         setAuthTokens(data)
    //         setUser(jwt_decode(data.access))
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //         router.push("/")
    //     } else {
    //         alert('Something went wrong!')
    //     }
    // }

    // let authData = {
    //     loginUser: loginUser,
    //     user: user
    // }

    // useEffect(() => {
    //     authData.user = user
    // }, [user])

    // return (
    //     <AuthContext.Provider value={authData}>
    //             {children}
    //     </AuthContext.Provider>
    // )
// }

export { useAuthContext, AuthProvider, PrivateRoute }