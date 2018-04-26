import * as React from 'react';
import { forEach, values, find, map, compact } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SelectField, MenuItem, TextField, RaisedButton } from 'material-ui';
import * as editableConfigActions from '../editableConfig/editableConfigActions';
import * as configActions from '../configs/configActions';
import * as feedTypeActions from '../feedTypes/feedTypeActions';
import * as dataPartnerActions from '../dataPartners/dataPartnerActions';
import { routeActions, BranchInfo } from '../common';
import Config, { IConfig } from '../configs/config';
import * as copyConfigActions from './copyConfigActions';

import style from './copyConfigStyle';

interface IAddConfigProps {
    config: IConfig;
    configs: IConfig[];
    currentBranch: string;
    branches: any[];
    dataPartners: string[];
    feedTypes: string[];
    configActions: any;
    dataPartnerActions: any;
    feedTypeActions: any;
    routeActions: any;
    editableConfigActions: any;
}

interface IAddConfigState {
    dataPartner: string;
    feedType: string;
    subType: string;
    errors: any;
}

class CopyConfigPage extends React.Component<IAddConfigProps, IAddConfigState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dataPartner: (props.config.dataPartner || '').toUpperCase(),
            feedType: (props.config.feedType || '').toUpperCase(),
            subType: props.config.subType || '',
            errors: {}
        };

        this.chooseDataPartner = this.chooseDataPartner.bind(this);
        this.chooseFeedType = this.chooseFeedType.bind(this);
        this.setSubType = this.setSubType.bind(this);
        this.computeFileName = this.computeFileName.bind(this);
        this.computeSourceLayoutName = this.computeSourceLayoutName.bind(this);
        this.createConfig = this.createConfig.bind(this);
        this.cancel = this.cancel.bind(this);
        this.getCurrentBranch = this.getCurrentBranch.bind(this);
    }
    public componentWillMount() {
        this.props.editableConfigActions.fetchContent(this.props.config, this.props.currentBranch).then(() => {
            this.props.editableConfigActions.fetchSourceLayout(this.props.config, this.props.currentBranch);
        });

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
        const name = this.computeFileName();
        let { errors } = this.state;
        const mandatoryFields = ['dataPartner', 'feedType'];

        // reset error
        errors = {};

        forEach(mandatoryFields, (field: string) => {
            if (!this.state[field]) {
                errors[field] = 'required';
            }
        });

        // check duplicate
        if ((values(errors).length <= 0) && find(this.props.configs, { name: name })) {
            errors['dataPartner'] = 'already present';
            errors['feedType'] = 'already present';
            if (this.state.subType) { errors['subType'] = 'already present'; }
        }

        this.setState({ errors });

        if (values(errors).length > 0) {
            return false;
        }

        copyConfigActions.updateConfig(
            this.props.config,
            dataPartner,
            feedType,
            subType,
            this.computeFileName()
        );

        const sourceLayoutContent = this.props.config.sourceLayout.content;
        this.props.configActions.createConfig(this.props.config, this.props.currentBranch).then(() => {
            if (sourceLayoutContent.length > 0) {
                // create a copy of new source layout
                this.props.config.sourceLayout = { sha: '', name: this.computeSourceLayoutName(), content: sourceLayoutContent };
                this.props.editableConfigActions.updateSourceLayout(this.props.config, this.props.currentBranch);
            } else {
                this.props.routeActions.setRoute('configs');
            }
        }).then(() => {
            this.props.routeActions.setRoute('configs');
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
    private computeSourceLayoutName() {
        let fileName = '';
        const { dataPartner, feedType, subType } = this.state;

        if (dataPartner && feedType) {
            fileName = `${compact([dataPartner.toLowerCase(), feedType.toLowerCase(), subType.toLowerCase()]).join('_')}_source.cfg`;
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
                            errorText={this.state.errors.dataPartner}
                        >
                            {map(this.props.dataPartners, (partner) => {
                                return <MenuItem key={partner} value={partner} primaryText={partner} />;
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
                            errorText={this.state.errors.feedType}
                        >
                            {map(this.props.feedTypes, (feed) => {
                                return <MenuItem key={feed} value={feed} primaryText={feed} />;
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
                            errorText={this.state.errors.subType}
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
        config: state.editableConfig,
        configs: state.configs,
        currentBranch: state.currentBranch,
        branches: state.branches,
        dataPartners: state.dataPartners,
        feedTypes: state.feedTypes
    };
};
const mapStateToDispatch = (dispatch) => {
    return ({
        editableConfigActions: bindActionCreators(editableConfigActions, dispatch),
        configActions: bindActionCreators(configActions, dispatch),
        feedTypeActions: bindActionCreators(feedTypeActions, dispatch),
        dataPartnerActions: bindActionCreators(dataPartnerActions, dispatch),
        routeActions: bindActionCreators(routeActions, dispatch)
    });
};

export default connect(mapStateToProps, mapStateToDispatch)(CopyConfigPage);

