import React from 'react'

const AuthenticationContext = React.createContext({
    username: '',
    accountType: '',
    email: '',
    userID: '',
    login: (email, password) => {},
    logout: () => {},
})

export default AuthenticationContext
