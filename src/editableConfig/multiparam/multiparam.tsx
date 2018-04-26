import * as React from 'react';
import { IConfig } from '../../configs/config';

import ActionButtons from '../editableConfigActionButtons';
import { RemoveButton } from '../common';
import AddMultiparamSectionButton from './addMultipramSectionButton';
import MultiparamSections from './multiparamSections';
import style from './multiParamStyle';
import * as multiparamActions from './multiparamActions';

interface IEditConfigProps {
    config: IConfig;
    index?: number;
    onSave: (any) => void;
    onRemove: () => void;
}

interface IMultiparamState {
    multiparam: any[];
}

export default class Multiparam extends React.Component<IEditConfigProps, IMultiparamState> {
    private availableTargetColumns: any[] = [];
    private allMappedValues: string[] = [];
    private allColumns: any[] = [];
    constructor(props, context) {
        super(props, context);

        this.addSection = this.addSection.bind(this);
        this.updateSection = this.updateSection.bind(this);
        this.removeSection = this.removeSection.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.onSave = this.onSave.bind(this);

        this.allColumns = this.props.config.uniqTargetColumns;
        this.availableTargetColumns = this.props.config.getUnmappedColumns('multiparam', this.props.index);
        this.allMappedValues = this.props.config.getMappedValues('multiparam', this.props.index);
        this.state = {
            multiparam: this.props.config.getFilter('multiparam', this.props.index) || []
        };
    }

    public componentWillReceiveProps(nextProps) {
        this.allColumns = this.props.config.uniqTargetColumns;
        this.availableTargetColumns = nextProps.config.getUnmappedColumns('multiparam', nextProps.index);
        this.allMappedValues = nextProps.config.getMappedValues('multiparam', nextProps.index);

        this.setState({
            multiparam: nextProps.config.getFilter('multiparam', nextProps.index) || []
        });
    }

    private addSection(sectionName) {
        const { multiparam } = this.state;

        multiparam.unshift({
            method: sectionName,
            params: {}
        });

        this.setState({ multiparam });
    }

    public updateSection(section: any, index: number) {
        const { multiparam } = this.state;
        multiparam[index] = section;

        this.setState({ multiparam });
    }

    public removeSection(index: number) {
        const { multiparam } = this.state;
        multiparam.splice(index, 1);

        this.setState({ multiparam });
    }

    public onSave(event) {
        multiparamActions.updateMultiparam(this.props.config, this.state.multiparam, this.props.index);
        this.props.onSave(this.props.config);
    }
    private removeFilter() {
        this.props.onRemove();
    }

    public render(): JSX.Element {
        return (<div>
            <div style={style.buttonsContainer}>
                <AddMultiparamSectionButton onAdd={this.addSection} />
                <RemoveButton onClick={this.removeFilter} />
            </div>

            <MultiparamSections
                allTargetColumns={this.allColumns}
                allUnmappedTargetColumns={this.availableTargetColumns}
                allMappedValues={this.allMappedValues}
                onUpdate={this.updateSection}
                onRemove={this.removeSection}
                sections={this.state.multiparam}
            />

            {this.state.multiparam.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}
        </div>);
    }
}

