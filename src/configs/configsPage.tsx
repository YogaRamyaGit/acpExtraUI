import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import style from './configsPageStyle';

import ConfigsContainer from '../configs/configsContainer';
import BranchSelector from '../branches/branchSelector';
import AddConfig from '../addConfig/addConfig';
import { SyncConfigs } from '../common';

class ConfigsPage extends React.Component<null, null> {
    public render(): JSX.Element {
        return (
            <div style={style.pageContainer}>
                <div style={style.topBarContainer}>
                    <div>
                        <AddConfig />
                    </div>

                    <div>
                        <BranchSelector />
                        <SyncConfigs />
                    </div>
                </div>
                <div style={style.tableContainer}>
                    <ConfigsContainer />
                </div>
            </div>
        );
    }
}

export default withRouter(connect()(ConfigsPage));
