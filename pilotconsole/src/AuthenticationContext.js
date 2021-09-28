import React from 'react'

const AuthenticationContext = React.createContext({
    userName: '',
    accountType: '',
    email: '',
    userID:'',
    login: (email, password) => {},
    logout: () => {},

})

export default AuthenticationContext