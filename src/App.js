import React, {Component} from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import classes from './App.css';
import Dashboard from './containers/Admin/Dashboard/Dashboard';
import Layout from "./components/UI/Layout/Layout";
import Login from "./containers/Auth/Login/Login";
import Register from "./containers/Auth/Register/Register";
import Logout from "./containers/Auth/Logout/Logout";
import User from "./containers/Admin/User/User";
import UserDelete from "./containers/Admin/User/UserDelete";

import { inject } from "mobx-react";


class App extends Component {
    componentDidMount() {
        this.props.authState.setAuthRedirectPath(this.props.location.pathname || '/');
        this.props.authState.authCheckState();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/login" render={props => <Login {...props} />}/>
                <Route path="/register" render={props => <Register {...props} />}/>
                <Redirect to="/login"/>
            </Switch>
        );

        if (this.props.authState.token !== null) {
            routes = (
                <Switch>
                    <Route path="/logout" render={props => <Logout {...props} />}/>
                    <Route path="/login" render={props => <Login {...props} />}/>
                    <Route path="/user-delete" component={UserDelete} />
                    <Route path="/user" render={props => <User {...props} />}/>
                    <Route path="/" exact component={Dashboard} />
                    <Redirect to="/" />
                </Switch>
            );
        }

        return (
            <div className={classes.App}>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }
}

export default inject("authState")(withRouter(App));
