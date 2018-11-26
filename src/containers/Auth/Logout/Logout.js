import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {inject} from "mobx-react";

class Logout extends Component {
    componentDidMount() {
        this.props.authState.authLogout();
    }

    render() {
        return <Redirect to="/login" />
    }
}

export default inject("authState")(Logout);
