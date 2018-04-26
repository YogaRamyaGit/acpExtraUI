import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withRouter } from 'react-router';

import style from './homePageStyle';

import apps, { IApp } from './apps';
import * as appActions from './appsActions';
import * as branchActions from '../branches/branchActions';
import { Card, CardActions, CardHeader, CardText, FlatButton } from 'material-ui';
import { routeActions } from '../common';

interface IHomePageProps {
    branches: any[];
    routeActions: any;
    branchActions: any;
    appActions: any;
}

class HomePage extends React.Component<IHomePageProps, null> {
    constructor(props, context) {
        super(props, context);

        this.visitApp = this.visitApp.bind(this);
    }
    public componentWillMount() {
        if (this.props.branches.length <= 0) {
            this.props.branchActions.fetchBranches();
        }
    }
    private visitApp(app: IApp) {
        this.props.appActions.setCurrentApp(app);
        this.props.routeActions.setRoute(app.redirectTo);
    }
    public render(): JSX.Element {
        return (
            <div style={style.pageContainer} >
                {apps.map((app: IApp, index: number) => {
                    return <Card key={index}>
                        <CardHeader
                            title={app.name}
                            subtitle={app.description}
                        />
                        <CardText>{app.content}</CardText>
                        <CardActions>
                            <FlatButton label="Visit" onClick={() => this.visitApp(app)} />
                        </CardActions>
                    </Card>;
                })}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        branches: state.branches
    };
};
const mapDispatchToProps = (dispatch) => {
    return ({
        routeActions: bindActionCreators(routeActions, dispatch),
        branchActions: bindActionCreators(branchActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    });
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
