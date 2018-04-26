import * as React from 'react';
import { AppBar, FlatButton } from 'material-ui';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import routeActions from './route/routeActions';
import * as userActions from '../user/userActions';

interface IAppBarProps {
    user: any;
    dispatch: (action: any) => Promise<any>;
}

const style: {[key: string]: React.CSSProperties} = {
    container: {
        position: 'fixed',
        top: 0
    },
    label: {
        color: '#fff',
        fontSize: 20
    },
    button: {
        marginTop: 5
    },
    action: {
        color: '#fff'
    }
};

const UserActions = (props: { user: any, login: () => void, logout: () => void }): JSX.Element => {
    if (props.user.login) {
        return <div style={style.action}>
            <span>{props.user.login}</span> |
            <FlatButton
                label="Logout"
                onClick={props.logout}
                style={style.button}
                labelStyle={style.action}
            />
        </div>;
    } else {
        return <FlatButton
            label="Login With Github"
            onClick={props.login}
            style={style.button}
            labelStyle={style.action}
        />;
    }
};

class TopAppBar extends React.Component<IAppBarProps, null> {
    constructor(props, context) {
        super(props, context);

        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.goHome = this.goHome.bind(this);
    }
    private logout() {
        this.props.dispatch(userActions.logout()).then(() => {
            this.props.dispatch(routeActions.setRoute('login'));
        });
    }
    private goHome(event) {
        this.props.dispatch(routeActions.setRoute('home'));
    }
    private login() {
        userActions.login();
    }
    public render(): JSX.Element {
        const rightIcon = <UserActions user={this.props.user} login={this.login} logout={this.logout} />;
        return (
            <AppBar
                style={style.container}
                iconElementRight={rightIcon}
                showMenuIconButton={false}
                title={<FlatButton onClick={this.goHome} label="ACP-Extra Config Editor" labelStyle={style.label} />}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.loggedInUser
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        dispatch: dispatch
    });
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopAppBar));
