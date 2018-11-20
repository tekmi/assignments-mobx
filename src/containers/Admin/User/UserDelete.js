import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import axios from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";

import {Subscribe} from 'unstated';
import AuthStateContainer from './../../../store/AuthContainer';
import UserStateContainer from './../../../store/UserContainer';

class UserDelete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reallyDelete: false
        }
    }

    inputChangedHandler = (event, authStateContainer, userStateContainer) => {
        // BUU: looks like you must pass the authLogout method reference to call it from other state container
        userStateContainer.userDelete(
            authStateContainer.state.token,
            authStateContainer.state.user.id,
            authStateContainer.authLogout
        );
    };

    render() {
        return (
            <Subscribe to={[AuthStateContainer, UserStateContainer]}>
                {
                    (authStateContainer, userStateContainer) => (
                        <div>
                            <Toolbar/>
                            <h3>Deleting user: <i>{authStateContainer.state.user.email}</i></h3>
                            <br/><br/>
                            <button type="submit" className="btn btn-danger" onClick={(event) => this.inputChangedHandler(event, authStateContainer, userStateContainer)}>Delete my account right now and log me out </button>
                        </div>
                    )
                }
            </Subscribe>
        );
    }
}

export default withErrorHandler(UserDelete, axios);
