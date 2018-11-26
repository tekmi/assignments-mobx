import React, {Component} from 'react';
import {NavLink, Redirect} from "react-router-dom";
import classes from './../../../App.css';
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from './../../../helpers/axios';
import withErrorHandler from "../../../hoc/withErrorHandler";

import { observer, inject } from "mobx-react";

const Login = observer(class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: {value: '', error: '', touched: false},
            password: {value: '', error: '', touched: false},
            isValid: false
        }
    }

    inputChangedHandler = (event) => {
        this.setState({
            [event.target.id]: {
                ...this.state[event.target.id],
                value: event.target.value,
                touched: true,
                error: event.target.checkValidity() === false ? event.target.validationMessage : ''
            },
            isValid: event.target.form.checkValidity()
        });
    };

    submitHandler = (event) => {
        event.preventDefault();

        if (event.target.checkValidity() === false) {
            return;
        }

        this.props.authState.auth(this.state.email.value, this.state.password.value);
    };

    render() {
        let authRedirect = null;
        if (this.props.authState.token) {
            const redirectTo = this.props.authState.authRedirectPath && this.props.authState.authRedirectPath !== "/login" ? this.props.authState.authRedirectPath : "/";
            authRedirect = <Redirect to={redirectTo}/>;
        }

        let login = <Spinner/>;
        if (!this.props.authState.loading) {
            login = (
                <form method="post" noValidate onSubmit={(event) => this.submitHandler(event)}>
                    <div className={this.state.email.touched ? 'form-group was-validated' : 'form-group'}>
                        <input type="email" name="email" className="form-control" id="email"
                               aria-describedby="emailHelp" placeholder="Please enter email"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.email.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.email.error}</div>
                    </div>
                    <div className={this.state.password.touched ? 'form-group was-validated' : 'form-group'}>
                        <input type="password" name="password" className="form-control" id="password"
                               minLength="6"
                               placeholder="Please enter password"
                               onChange={(event) => this.inputChangedHandler(event)}
                               onBlur={(event) => this.inputChangedHandler(event)}
                               value={this.state.password.value}
                               required="required"/>
                        <div className="invalid-feedback">{this.state.password.error}</div>
                    </div>
                    <div className={classes.FormNavButtons}>
                        <button type="submit" className="btn btn-success" disabled={!this.state.isValid}>Log
                            in
                        </button>
                        <NavLink className="btn btn-primary" to="/register">Register if you don't have yet an
                            account</NavLink>
                    </div>
                </form>
            )
        }

        return (
            <div className="container">
                <h1>Login</h1>
                {authRedirect}
                {login}
            </div>
        );
    }
});

export default inject("authState")(withErrorHandler(Login, axios));

