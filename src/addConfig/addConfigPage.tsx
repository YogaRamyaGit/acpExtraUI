import * as React from 'react';
import { map, compact, find } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SelectField, MenuItem, TextField, RaisedButton } from 'material-ui';
import * as configActions from '../configs/configActions';
import * as feedTypeActions from '../feedTypes/feedTypeActions';
import * as dataPartnerActions from '../dataPartners/dataPartnerActions';
import { routeActions, BranchInfo } from '../common';
import Config, { IConfig } from '../configs/config';

import style from './addConfigStyle';

interface IAddConfigProps {
    currentBranch: string;
    branches: any[];
    dataPartners: string[];
    feedTypes: string[];
    configActions: any;
    dataPartnerActions: any;
    feedTypeActions: any;
    routeActions: any;
}

interface IAddConfigState {
    dataPartner: string;
    feedType: string;
    subType: string;
}

class AddConfigPage extends React.Component<IAddConfigProps, IAddConfigState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dataPartner: '',
            feedType: '',
            subType: ''
        };

        this.chooseDataPartner = this.chooseDataPartner.bind(this);
        this.chooseFeedType = this.chooseFeedType.bind(this);
        this.setSubType = this.setSubType.bind(this);
        this.computeFileName = this.computeFileName.bind(this);
        this.createConfig = this.createConfig.bind(this);
        this.cancel = this.cancel.bind(this);
        this.getCurrentBranch = this.getCurrentBranch.bind(this);
    }
    public componentWillMount() {
        if (this.props.dataPartners.length <= 0) {
            this.props.dataPartnerActions.fetchDataPartners();
        }
        if (this.props.feedTypes.length <= 0) {
            this.props.feedTypeActions.fetchFeedTypes();
        }
    }
    private chooseDataPartner(event, index, dataPartner) {
        this.setState({ dataPartner });
        this.computeFileName();
    }
    private chooseFeedType(event, index, feedType) {
        this.setState({ feedType });
        this.computeFileName();
    }
    private setSubType(event) {
        this.setState({ subType: event.target.value });
        this.computeFileName();
    }
    private createConfig() {
        const { dataPartner, feedType, subType } = this.state;
        if (!(dataPartner && feedType)) {
            return false;
        }
        const config: IConfig = new Config({
            dataPartner,
            feedType,
            subType,
            name: this.computeFileName()
        });

        // Sets data partner and feed type in the content
        config.buildContent();

        this.props.configActions.createConfig(config, this.props.currentBranch).then(() => {
            const feedName = config.subType ? [config.feedType, config.subType].join('_') : config.feedType;
            this.props.routeActions.setRoute('editConfig', { branch: this.props.currentBranch, partner: config.dataPartner, feed: feedName });
        });
    }
    private cancel() {
        this.props.routeActions.setRoute('configs');
    }
    private computeFileName() {
        let fileName = '';
        const { dataPartner, feedType, subType } = this.state;

        if (dataPartner && feedType) {
            fileName = `${compact([dataPartner.toLowerCase(), feedType.toLowerCase(), subType.toLowerCase()]).join('_')}.cfg`;
        }

        return fileName;
    }
    private getCurrentBranch() {
        const { branches, currentBranch } = this.props;

        return find(branches, { name: currentBranch }) || { name: currentBranch };
    }
    public render(): JSX.Element {
        return (<div>
            <BranchInfo currentBranch={this.getCurrentBranch()} />
            <div style={style.wrapper}>
                <form className="col-md-5" style={style.form}>
                    <div>
                        <SelectField
                            floatingLabelText="Data Partner"
                            value={this.state.dataPartner}
                            onChange={this.chooseDataPartner}
                            fullWidth={true}
                            floatingLabelFixed={true}
                        >
                            {map(this.props.dataPartners, (partner, index) => {
                                return <MenuItem key={index} value={partner} primaryText={partner} />;
                            })}
                        </SelectField>
                    </div>

                    <div>
                        <SelectField
                            floatingLabelText="Feed Type"
                            value={this.state.feedType}
                            onChange={this.chooseFeedType}
                            fullWidth={true}
                            floatingLabelFixed={true}
                        >
                            {map(this.props.feedTypes, (feed, index) => {
                                return <MenuItem key={index} value={feed} primaryText={feed} />;
                            })}
                        </SelectField>
                    </div>
                    <div>
                        <TextField
                            floatingLabelText="Sub Type"
                            value={this.state.subType}
                            onChange={this.setSubType}
                            fullWidth={true}
                            floatingLabelFixed={true}
                        />
                    </div>
                    <div>
                        <TextField
                            floatingLabelText="File Name"
                            value={this.computeFileName()}
                            disabled={true}
                            fullWidth={true}
                            floatingLabelFixed={true}
                        />
                    </div>
                    <div style={style.submitButtons}>
                        <RaisedButton label="Cancel" onClick={this.cancel} style={style.button} />
                        <RaisedButton label="Create" primary={true} onClick={this.createConfig} />
                    </div>
                </form>
            </div>
        </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        currentBranch: state.currentBranch,
        branches: state.branches,
        dataPartners: state.dataPartners,
        feedTypes: state.feedTypes
    };
};
const mapStateToDispatch = (dispatch) => {
    return ({
        configActions: bindActionCreators(configActions, dispatch),
        feedTypeActions: bindActionCreators(feedTypeActions, dispatch),
        dataPartnerActions: bindActionCreators(dataPartnerActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch)
    });
};

export default connect(mapStateToProps, mapStateToDispatch)(AddConfigPage);

