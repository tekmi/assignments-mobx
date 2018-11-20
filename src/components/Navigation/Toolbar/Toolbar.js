import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Toolbar.css';
import logo from '../../../assets/images/logo.png';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <img className={classes.Logo} src={logo} alt="Logo" />
            <nav>
                <ul className={classes.NavigationItems}>
                    <li className={classes.NavigationItem}>
                        <NavLink to="/">Dashboard</NavLink>
                        <NavLink to="/user">User Details</NavLink>
                        <NavLink to="/logout">Logout</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default toolbar;
