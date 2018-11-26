import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import {inject} from "mobx-react";

class Dashboard extends Component {
    render() {
        return (
            <div>
                <Toolbar/>
                <h1>Dashboard</h1>
                <h3>Hi {this.props.authState.user.email}</h3>
            </div>
        )
    }
}

export default inject("authState")(Dashboard);
