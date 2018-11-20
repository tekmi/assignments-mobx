import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";

import {Subscribe} from 'unstated';
import AuthStateContainer from './../../../store/AuthContainer';

class Dashboard extends Component {
    render() {
        return (
            <Subscribe to={[AuthStateContainer]}>
                {
                    authStateContainer => (
                        <div>
                            <Toolbar />
                            <h1>Dashboard</h1>
                            <h3>Hi {authStateContainer.state.user.email}</h3>
                        </div>
                    )
                }
            </Subscribe>
        );
    }
}

export default Dashboard;
