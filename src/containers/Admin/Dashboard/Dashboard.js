import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";

import {AuthConsumer} from './../../../store/AuthProvider';

class Dashboard extends Component {
    render() {
        return (
            <AuthConsumer>
                { authContext => (
                        <div>
                            <Toolbar/>
                            <h1>Dashboard</h1>
                            <h3>Hi {authContext.state.user.email}</h3>
                        </div>
                    )
                }
            </AuthConsumer>
        );
    }
}

export default Dashboard;
