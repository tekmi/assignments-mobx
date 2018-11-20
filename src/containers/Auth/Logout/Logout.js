import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Logout extends Component {
    componentDidMount() {
        this.props.authStateContainer.authLogout();
    }

    render() {
        return <Redirect to="/login" />
    }
}

export default Logout;
