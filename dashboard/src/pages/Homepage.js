import './Homepage.css'

import React, { useState, useEffect, useRef } from 'react'

import Login from '../components/Login'
import Register from '../components/Register'
import bg1 from '../assets/backgrounds/1.png'
import bg2 from '../assets/backgrounds/6.png'
import bg3 from '../assets/backgrounds/5.png'
import logo from '../assets/brand/white/silvereyes_sm_square_wide.svg'

const Homepage = () => {
    const [viewMode, setViewMode] = useState('logIn')
    const bgChange = useRef()
    
    useEffect(() => {
        let bgChange = true

        function bgImgScheduler1() {
            setTimeout(() => {
                if (bgChange === true)
                    document.querySelector(`.img1`).style.opacity = 0
                if (bgChange === true)
                    document.querySelector('.img2').style.opacity = 1
                if (bgChange === true)
                    document.querySelector('.img3').style.opacity = 1
                order(
                    ['-3', '-1', '-2'],
                    () => {
                        bgImgScheduler2()
                    },
                    1000
                )
            }, 3000)
        }

        function bgImgScheduler2() {
            setTimeout(() => {
                if (bgChange === true)
                    document.querySelector('.img1').style.opacity = 1
                if (bgChange === true)
                    document.querySelector('.img2').style.opacity = 0
                if (bgChange === true)
                    document.querySelector('.img3').style.opacity = 1
                order(
                    ['-2', '-3', '-1'],
                    () => {
                        bgImgScheduler3()
                    },
                    1000
                )
            }, 3000)
        }

        function bgImgScheduler3() {
            setTimeout(() => {
                if (bgChange === true)
                    document.querySelector('.img1').style.opacity = 1
                if (bgChange === true)
                    document.querySelector('.img2').style.opacity = 1
                if (bgChange === true)
                    document.querySelector('.img3').style.opacity = 0
                order(
                    ['-1', '-2', '-3'],
                    () => {
                        bgImgScheduler1()
                    },
                    1000
                )
            }, 3000)
        }

        function order(array, callback, time) {
            setTimeout(() => {
                if (bgChange === true)
                    document.querySelector('.img1').style.zIndex = array[0]
                if (bgChange === true)
                    document.querySelector('.img2').style.zIndex = array[1]
                if (bgChange === true)
                    document.querySelector('.img3').style.zIndex = array[2]
                callback()
            }, time)
        }

        bgImgScheduler1()

        return () => {
            bgChange = false
        }
    }, [])

    return (
        <div className="grid-container">
            <img class="background-image img1" src={bg1} alt=""></img>
            <img class="background-image img2" src={bg2} alt=""></img>
            <img class="background-image img3" src={bg3} alt=""></img>

            <div className="header"></div>

            <div className="section-hero">
                {/* <h1>Team Silvereyes</h1> */}
                {/* <h2>Customer dashboard</h2> */}
                {/* <h1>logo</h1> */}
                <img
                    class="logo"
                    src={logo}
                    alt="silvereyes"
                    width="450px"
                ></img>
            </div>

            <div className="section-login">
                {viewMode === 'logIn' && (
                    <>
                        <Login />

                        <div className="row-five">
                            <p className="register">
                                Not registered?{' '}
                                <span
                                    className="register-link"
                                    onClick={() => {
                                        setViewMode('register')
                                    }}
                                >
                                    Register here.
                                </span>
                            </p>
                            {/* <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setViewMode('register')
                                }}
                            >
                                Register here
                            </button> */}
                        </div>
                    </>
                )}

                {viewMode === 'register' && <Register setViewMode={(viewMode)=>setViewMode(viewMode)}/>}
            </div>
        </div>
    )
}

export default Homepage
