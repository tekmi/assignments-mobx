import React, {Component} from 'react';
import Wrapper from './../../../hoc/Wrapper';
import classes from './Layout.css';

export class Layout extends Component {
    render() {
        return (
            <Wrapper>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Wrapper>
        );
    }
}

export default Layout;
