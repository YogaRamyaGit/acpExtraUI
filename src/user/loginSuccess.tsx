import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userActions from './userActions';
import { routeActions } from '../common';

import style from './loginStyle';

interface ILoginSuccessProps {
    userActions: any;
    routeActions: any;
}

class LoginSuccessPage extends React.Component<ILoginSuccessProps, null> {

    public componentDidMount() {
        const params = new URL(window.location.href).searchParams;
        const state = params.get('state');
        const code = params.get('code');

        this.props.userActions.getUserInfo(code, state).then(() => {
            this.props.routeActions.setRoute('home');
        });
    }

    public render(): JSX.Element {
        return (<div style={style.wrapper} />);
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        userActions: bindActionCreators(userActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch)
    });
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginSuccessPage);
