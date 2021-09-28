import './Homepage.css'

import React, { useContext, useState } from 'react'

import AuthenticationContext from '../AuthenticationContext'
import Login from '../components/Login'
import Register from '../components/Register'
import { useHistory } from 'react-router-dom'
import logo from '../assets/brand/white/silvereyes_sm_square_45.svg'
import bg1 from '../assets/backgrounds/1.png'

const Homepage = () => {
    const authContext = useContext(AuthenticationContext)
    const [viewMode, setViewMode] = useState('logIn')

    //login as guest only.  Will have no access to work order information
    const loginAsGuest = async () => {
        // set the values to guest login
        let loginStatus = await authContext.login('guest@guest.com', 'guest')
        if (loginStatus === 'Login Successful') history.push('/pilotconsole')
    }

    const history = useHistory()

    return (
        <div className="grid-container">
            <img class="background-image img1" src={bg1} alt=""></img>

            <div className="header"></div>
            <div className="section-hero">
                <img
                    class="logo"
                    src={logo}
                    alt="silvereyes"
                    width="450px"
                ></img>
            </div>
            <div className="section-info">
                <h3>Pilot Console</h3>
            </div>
            <div className="section-login-guest">
                <div className="section-login-guest-left">
                    <h4>Welcome, Aircrew</h4>
                </div>
                <div className="section-login-guest-right">
                    {/* <button className="btn btn-primary" onClick={() => { loginAsGuest() }}> Continue as a Guest </button> */}
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            history.push('/pilotconsole')
                        }}
                    >
                        Login as Guest
                    </button>
                </div>
            </div>
            <div className="section-login-registered ">
                {viewMode === 'logIn' && (
                    <>
                        <Login />
                        <div className="row-five">
                            <p className="register">
                                Not Registered?{' '}
                                <span
                                    className="register-link"
                                    onClick={() => {
                                        setViewMode('register')
                                    }}
                                >
                                    Register Here.
                                </span>
                            </p>
                        </div>
                    </>
                )}

                {viewMode === 'register' && <Register setViewMode={(viewMode)=>setViewMode(viewMode)}/>}
            </div>
        </div>
    )
}

export default Homepage
