import { faChartLine, faChild, faSignOutAlt, faStar, faTachometerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React,{useEffect} from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthProvider'
import '../styles/sidebar.css'

function Sidebar() {
    const {currentUser,logout} = useAuth()
    const history = useHistory()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/")
        } catch {
          console.log("Failed to log out")
        }
      }

    useEffect(() => {
        if(currentUser && currentUser.uid)
        {
            if(!currentUser.isStudent)
                handleLogout()
        }else
        {
            handleLogout()
        }
    }, [])
    return (
        <div className="sidebar">
            <div className="brand-sidebar">Activity to hiring</div>
            <div className="brand-sidebar-verticle">Actohire</div>
            <ul className="sidebar-container">
                <NavLink activeClassName="selected-nav" to="/dashboard"><li>
                    <FontAwesomeIcon icon={faTachometerAlt}/> 
                    <span>Dashboard</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/awards"><li>
                    <FontAwesomeIcon icon={faStar}/> 
                    <span>Awards</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/stats"><li>
                    <FontAwesomeIcon icon={faChartLine}/> 
                    <span>Stats</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/jobs"><li>
                    <FontAwesomeIcon icon={faChild}/> 
                    <span>Jobs</span>
                </li></NavLink>
                <NavLink activeClassName="selected-nav" to="/profile"><li>
                    <FontAwesomeIcon icon={faUserTie}/> 
                    <span>Profile</span>
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
