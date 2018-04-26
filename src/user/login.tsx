import * as React from 'react';

import { Card, CardHeader, CardText, RaisedButton } from 'material-ui';
import ActionHome from 'material-ui/svg-icons/action/home';

import GithubIcon from '../common/githubIcon';
import style from './loginStyle';
import * as userActions from './userActions';

class LogInPage extends React.Component<null, null> {
    constructor(props, context) {
        super(props, context);
    }
    private startLoginProcess() {
        // redirect to github
        userActions.login();
    }
    public render(): JSX.Element {
        return (
            <div style={style.wrapper}>
                <div style={style.container}>
                    <Card className="col-md-4">
                        <CardText style={style.text}>
                            <h3>Login with GitHub to get started</h3>
                            <RaisedButton
                                primary={true}
                                label={'Login With GitHub'}
                                onClick={this.startLoginProcess}
                                icon={<GithubIcon width={20} height={20} />}
                            />
                        </CardText>
                    </Card>
                </div>
            </div>
        );
    }
}

export default LogInPage;
