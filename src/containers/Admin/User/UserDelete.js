import React, {Component} from 'react';
import Toolbar from "../../../components/Navigation/Toolbar/Toolbar";
import axios from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";

import {inject, observer} from "mobx-react";
import {Redirect} from "react-router-dom";

class UserDelete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reallyDelete: false
        }
    }

    inputChangedHandler = (event) => {
        const { myAuthState, myUserState } = this.props;

        myUserState.userDelete(
            myAuthState.token,
            myAuthState.user.id
        );
    };

    render() {
        const {myAuthState} = this.props;

        if (!myAuthState.user) {
            return <Redirect to="/login" />;
        }

        return (
            <div>
                <Toolbar/>
                <h3>Deleting user: <i>{myAuthState.user.email}</i></h3>
                <br/><br/>
                <button type="submit" className="btn btn-danger" onClick={(event) => this.inputChangedHandler(event)}>Delete my account right now and log me out </button>
            </div>
        );
    }
}

export default withErrorHandler(
    // This way you can decide how you inject your Mobx stores. Please remember that you must call inject and then observer in this, certain order!
    inject(({authState, userState}) => ({myAuthState: authState, myUserState: userState}))(observer(UserDelete)),
    axios
);
