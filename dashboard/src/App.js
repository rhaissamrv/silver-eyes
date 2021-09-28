import './App.css'

import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch
} from 'react-router-dom'

import AuthenticationContext from './AuthenticationContext'
import AuthenticationProvider from './AuthenticationProvider'
import Header from './components/Header'
import Homepage from './pages/Homepage'
import PilotInfo from './components/PilotInfo'
import React from 'react'
//import ScheduleJobs from './components/ScheduleJobs'
import WorkOrderDetails from './components/WorkOrderDetails'
import Workorders from './pages/Workorders'
import Adminpage from './pages/Adminpage'
import { useContext } from 'react'

function App() {
    const displayHeader = () => {
        return (
            <div className="app-header">
                <Header />
            </div>
        )
    }

    return (
        <div className="contain">
            <AuthenticationProvider>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => <Homepage />} />

                        <PrivateRoute
                            exact
                            path="/workorders"
                            roles={['admin', 'customer', 'pilot']}
                        >
                            {displayHeader()}
                            <div className="app-content">
                                <Workorders />
                            </div>
                        </PrivateRoute>

                        <PrivateRoute
                            exact
                            path="/workorders/:id"
                            roles={['admin', 'customer', 'pilot']}
                        >
                            {displayHeader()}
                            <div className="app-content">
                                <WorkOrderDetails />
                            </div>
                        </PrivateRoute>

                        <PrivateRoute
                            exact
                            path="/pilot/:pilot"
                            roles={['admin', 'customer', 'pilot']}
                        >
                            <PilotInfo />
                        </PrivateRoute>

                        <PrivateRoute exact path="/admin" roles={['admin']}>
                            {displayHeader()}
                            <div className="app-content">
                                <Adminpage />
                            </div>
                        </PrivateRoute>
                    </Switch>
                </Router>
            </AuthenticationProvider>
        </div>
    )
}

// route wrapper.  Only allow access to PrivateRoutes if user is logged in
function PrivateRoute({ children, roles, ...rest }) {
    const authContext = useContext(AuthenticationContext)
    console.log('authentication', authContext.email)

    const checkRoles = () => {
        // check to see if current user is one of the allowed roles to access the site
        let found = roles.find((role) => role === authContext.accountType)
            ? true
            : false
        return found
    }
    return (
        <Route
            {...rest}
            render={({ location }) =>
                authContext.email && checkRoles() ? (
                    children
                ) : (
                    <Redirect
                        to={{ pathname: '/', state: { from: location } }}
                    />
                )
            }
        />
    )
}

export default App
