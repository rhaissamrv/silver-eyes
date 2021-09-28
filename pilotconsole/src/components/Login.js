// import "bootstrap/dist/css/bootstrap.css"
import './Login.css'

import * as Yup from 'yup'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'

import AuthenticationContext from '../AuthenticationContext'
import { useHistory } from 'react-router-dom'

const Login = () => {
    const authContext = useContext(AuthenticationContext)

    const history = useHistory()
    const [loginError, setLoginError] = useState(false)

    return (
        <div className="login-register-login-form">
            <Formik
                initialValues={{ email: '', password: '' }}
                // validates against the validation schema defined as Yup Object

                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address format')
                        .required('E-mail is Required'),
                    password: Yup.string().required('Password is Required')
                })}
                onSubmit={async (values) => {
                    // on submission of form, set the values to be sent to login function
                    // if login fails, will ask user to try again
                    let loginStatus = await authContext.login(
                        values.email,
                        values.password
                    )
                    if (loginStatus === 'Network Unavailable')
                        setLoginError(
                            'Network Unavailable.  Please Try Again Later or Login as Guest'
                        )
                    else if (loginStatus === true) {
                        history.push('/pilotconsole')
                    } else {
                        setLoginError(
                            'Invalid e-mail or password.  Please Try Again or Login as Guest'
                        )
                    }
                }}
            >
                {/* touched object = true if field has been visited.  errors stores the all validation errros */}
                {({ errors, touched }) => (
                    <Form className="form-login-register">
                        <div className="login-layout">
                            <div className="row-one">
                                <div className="login-header">
                                    <h4>Account Login</h4>
                                </div>
                            </div>
                            <div className="row-two">
                                <label htmlFor="e-mail">Email Address</label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter E-mail"
                                    className={`form-control ${
                                        touched.email && errors.email
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="email"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="row-three">
                                <label htmlFor="password">Password</label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    className={`form-control ${
                                        touched.password && errors.password
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="password"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="row-four-right">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{"width": "87px"}}
                                >
                                    Login
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <p className="login-error"> {loginError} </p>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login
