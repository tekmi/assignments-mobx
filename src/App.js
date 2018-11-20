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

class App extends Component {
    componentDidMount() {
        this.props.authStateContainer.setAuthRedirectPath(this.props.location.pathname || '/');
        this.props.authStateContainer.authCheckState();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/login" render={props => <Login {...props} authStateContainer={this.props.authStateContainer} />}/>
                <Route path="/register" render={props => <Register {...props} authStateContainer={this.props.authStateContainer} />}/>
                <Redirect to="/login"/>
            </Switch>
        );

        if (this.props.authStateContainer.state.token !== null) {
            routes = (
                <Switch>
                    <Route path="/logout" render={props => <Logout {...props} authStateContainer={this.props.authStateContainer} />}/>
                    <Route path="/login" render={props => <Login {...props} authStateContainer={this.props.authStateContainer} />}/>
                    <Route path="/user-delete" component={UserDelete} />
                    <Route path="/user" render={props => <User {...props} authStateContainer={this.props.authStateContainer} userStateContainer={this.props.userStateContainer} />}/>
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

export default withRouter(App);
