import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import axios from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";

import {AuthConsumer} from './../../../store/AuthProvider';
import {UserConsumer} from './../../../store/UserProvider';

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
            <AuthConsumer>
                {authContext => (
                    <UserConsumer>
                        {userContext => (
                            <div>
                                <Toolbar/>
                                <h3>Deleting user: <i>{authContext.state.user.email}</i></h3>
                                <br/><br/>
                                <button type="submit" className="btn btn-danger" onClick={(event) => this.inputChangedHandler(event, authContext, userContext)}>Delete my account right now and log me out </button>
                            </div>
                        )}
                    </UserConsumer>
                )}
            </AuthConsumer>
        );
    }
}

export default withErrorHandler(UserDelete, axios);
