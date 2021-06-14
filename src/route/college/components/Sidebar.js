import { faCogs, faSignOutAlt, faTable, faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../../../context/AuthProvider'
import '../../student/styles/sidebar.css'
import {NavLink} from 'react-router-dom'

function Sidebar() {
    const {currentUser ,logout} = useAuth()
    const history = useHistory()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/college-login")
        } catch {
          console.log("Failed to log out")
        }
    }

    useEffect(() => {

        if(currentUser && currentUser.uid)
        {
            if(!currentUser.isCollege)
                handleLogout()
            if(currentUser.expireDate)
            {
                var today = new Date()
                if(today >= currentUser.expireDate.toDate())
                {
                    history.push("/college-subscription")
                }   
            }
            else
                history.push("/college-subscription")
        }
    }, [currentUser])
    return (
        <div className="sidebar">
            <div className="brand-sidebar">Activity to hiring</div>
            <div className="brand-sidebar-verticle">Actohire</div>
            <ul class="sidebar-container">
                <NavLink activeClassName="selected-nav" to="/college-dashboard"><li>
                    <FontAwesomeIcon icon={faTable}/> 
                    <span>Dashboard</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/college-student"><li>
                    <FontAwesomeIcon icon={faUsers}/> 
                    <span>Students</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/college-job"><li>
                    <FontAwesomeIcon icon={faUserTie}/> 
                    <span>Jobs</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/college-settings"><li>
                    <FontAwesomeIcon icon={faCogs}/> 
                    <span>Settings</span>
                </li></NavLink>
                <li>
                    <Button variant="light" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </Button>
                </li>
                
            </ul>
        </div>
    )
}

export default Sidebar
