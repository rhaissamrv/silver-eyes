import './AccountTypeIcons.css'

import {
    faCertificate,
    faIdCardAlt,
    faUserAlt
} from '@fortawesome/free-solid-svg-icons'

import AuthenticationContext from '../AuthenticationContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'

const AccountTypeIcons = () => {
    const authContext = useContext(AuthenticationContext)

    let icon
    // console.log(`account type`, authContext.accountType)

    if (authContext.accountType == 'admin') {
        // console.log('admin-icon')
        // icon = 'admin-icon'
        icon = (
            <span className="fontawesome-icon-admin">
                <FontAwesomeIcon icon={faCertificate} className="icon" />
            </span>
        )
        return icon
    } else if (authContext.accountType == 'customer') {
        // console.log('customer-icon')
        // icon = 'customer-icon'
        icon = (
            <span className="fontawesome-icon-customer">
                <FontAwesomeIcon icon={faUserAlt} />
            </span>
        )
        return icon
    } else if (authContext.accountType == 'pilot') {
        // console.log('pilot-icon')
        // icon = 'pilot-icon'
        icon = (
            <span className="fontawesome-icon-pilot">
                <FontAwesomeIcon icon={faIdCardAlt} />
            </span>
        )

        return icon
    } else {
        return icon
    }
}

export default AccountTypeIcons
