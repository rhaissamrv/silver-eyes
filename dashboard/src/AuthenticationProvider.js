import AuthenticationContext from './AuthenticationContext'
import Axios from 'axios'
import { useState, useEffect } from 'react'

const AuthenticationProvider = ({ children }) => {
    let [username, setUsername] = useState('Guest') //temporary as 'GUEST' until hooked to authentication
    let [email, setEmail] = useState()
    let [accountType, setAccountType] = useState()
    let [userID, setUserID] = useState()
    let [loading, setLoading] = useState(true)

    // FUTURE note:  For dashboard, need to consider administrator role as well

    const reconnect = async () => {
        let user 
        try {
            user = await Axios.get('/login/loggedInUser')
        } catch (error) {            
            if (error.request) {
                // connection to database is unavailable
                // retain the last loaded values
                setLoading(false)
            }
        }    
        if (user) {
            setUsername(user.data.username)
            setEmail(user.data.email)
            setAccountType(user.data.account_type)
            setUserID(user.data._id)
        }
        console.log("reconnected", user)
        setLoading(false)
    }
    

    useEffect ( () => { 
        reconnect()
    }, [])


    const login = async (email, password) => {
        async function logintoServer() {
            let loggedInUser
            
            try {
                loggedInUser = await Axios({
                    method: 'POST',
                    data: { username: email, password: password },
                    withCredentials: true,
                    url: '/login'
                })
            }  catch (error) {
                if (error.request) {
                    return 'Network Unavailable'
                }
            }

            if (loggedInUser.data) {
                //set the global authentication variables according to the user info returned from login process
                setUsername(loggedInUser.data.username)
                setEmail(loggedInUser.data.email)
                setAccountType(loggedInUser.data.account_type)
                setUserID(loggedInUser.data._id)
            
                if (loggedInUser.data.account_type ==='admin')
                    return 'admin'
                else return 'user'
            
            } else {
                //log in failed
                return false
            }
        }

        const logInSuccess = await logintoServer()
        return logInSuccess
    }

    const logout = async () => {
        setUsername(null)
        setEmail(null)
        setAccountType(null)
        setUserID(null)
        await Axios.get('/logout')
    }

    let contextValue = {
        username,
        email,
        accountType,
        userID,
        login,
        logout,

    }

    return (
        <AuthenticationContext.Provider value={contextValue}>
            {  loading ? <div> Loading...</div> : children }
        </AuthenticationContext.Provider>
    )
}

export default AuthenticationProvider
