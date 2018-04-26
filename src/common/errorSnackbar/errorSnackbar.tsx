import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Snackbar } from 'material-ui';
import errorCodeActions from './errorCodeActions';
import routeActions from '../route/routeActions';

interface IErrorSnackbarProps {
    errorCode: number;
    actions: any;
    routeActions: any;
}
class ErrorSnackbar extends React.Component<IErrorSnackbarProps, null>{
    constructor(props, context) {
        super(props, context);

        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }
    private isSnackbarOpen() {
        return !!this.props.errorCode;
    }
    private getMessage() {
        if (!this.props.errorCode) {
            return '';
        }
        return this.props.errorCode === 401 ? 'Please login to access this page' : 'Something went wrong';
    }
    private getHideDuration() {
        return this.props.errorCode === 401 ? 1 : 4000;
    }
    private handleSnackbarClose() {
        if (this.props.errorCode === 401) {
            this.props.routeActions.setRoute('login');
        }
        this.props.actions.resetErrorCode();
    }
    public render(): JSX.Element {
        return <Snackbar
            open={this.isSnackbarOpen()}
            message={this.getMessage()}
            autoHideDuration={this.getHideDuration()}
            onRequestClose={this.handleSnackbarClose}
        />;
    }
}

const mapStateToProps = (state) => {
    return ({
        errorCode: state.errorCode
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        actions: bindActionCreators(errorCodeActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch)
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorSnackbar);
