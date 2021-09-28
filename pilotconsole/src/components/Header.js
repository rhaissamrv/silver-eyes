import AuthenticationContext from '../AuthenticationContext'
import JobDetailContext from '../JobDetailContext'
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import logo45 from '../assets/brand/black/silvereyes_sm_square_45_b.svg'

const Header = () => {
    const authContext = useContext(AuthenticationContext)
    const jobContext = useContext(JobDetailContext)
    const history = useHistory()

    return (
        <div>
            <div className="logo inline">
                <img
                    class="logo"
                    src={logo45}
                    alt="silvereyes"
                    height="28px"
                ></img>
            </div>
            <div className="navigation inline">
                {!authContext.userID && (
                    <button
                        onClick={() => {
                            history.push('/')
                        }}
                        className="small-button"
                    >
                        Login
                    </button>
                )}
                <button
                    onClick={() => {
                        history.push('/pilotConsole')
                    }}
                    className="small-button"
                >
                    Pilot Console
                </button>
                {authContext.userID && (
                    <button
                        onClick={() => {
                            history.push('/pilotjobs')
                        }}
                        className="small-button"
                    >
                        Load/View Pilot Jobs
                    </button>
                )}
                {jobContext.activeJob && (
                    <button
                        onClick={() => {
                            history.push('/flightreport')
                        }}
                        className="small-button"
                    >
                        Submit Report
                    </button>
                )}
                {authContext.userID && (
                    <button
                        onClick={() => {
                            authContext.logout()
                            jobContext.clearJob()
                            history.push('/')
                        }}
                        className="small-button"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    )
}

export default Header
