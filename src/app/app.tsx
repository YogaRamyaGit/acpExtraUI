import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { TopAppbar, RouteChanger, Loader, ErrorSnackbar } from '../common';
import theme from '../theme';

import style from './appStyle';

class App extends React.Component<null, null> {
    public render(): JSX.Element {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                <div className="body" style={style.body}>
                    <RouteChanger />
                    <Loader />
                    <TopAppbar />
                    <div style={style.containerStyle}>
                        {this.props.children}
                    </div>
                    <ErrorSnackbar />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};

export default withRouter(connect(mapStateToProps)(App));
