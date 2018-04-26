import * as React from 'react';
import * as _ from 'lodash';
import { IConfig } from '../../configs/config';
import { AddButton } from '../common';

import ActionButtons from '../editableConfigActionButtons';
import DirectMappingTable from './directMappingTable';
import * as directMappingActions from './directMappingActions';
import DirectMappingForm from './directMappingForm';

interface IEditConfigProps {
    config: IConfig;
    onSave: (any) => void;
}

interface IDirectMappingState {
    directMapping: any[];
    showAddMappingForm: boolean;
}

export default class DirectMapping extends React.Component<IEditConfigProps, IDirectMappingState> {
    constructor(props, context) {
        super(props, context);

        this.changeMapping = this.changeMapping.bind(this);
        this.showAddMappingForm = this.showAddMappingForm.bind(this);
        this.cancelAddMappingForm = this.cancelAddMappingForm.bind(this);
        this.onSave = this.onSave.bind(this);

        this.state = {
            directMapping: this.props.config.directMapping,
            showAddMappingForm: false
        };

    }
    private changeMapping(targetColumn: string, source: any = {}, defaultValue: string = '') {
        const directMapping: any[] = this.state.directMapping;
        const targetMap: any = _.find(directMapping, { name: targetColumn });
        const startOrEndPresent = !isNaN(parseInt(source.start, 10)) || !isNaN(parseInt(source.end, 10));
        const sourcePresent = this.props.config.layoutType === 'fixedWidth' ? startOrEndPresent : !isNaN(parseInt(source.position, 10));
        if (!sourcePresent) {
            // removed from mapping
            if (targetMap) {
                _.remove(directMapping, (map: any) => {
                    return map.name === targetColumn;
                });
            }
            this.setState({ directMapping });
            return;
        }

        if (targetMap) {
            // update the mapping
            if (defaultValue) {
                targetMap.default = defaultValue;
            }
            if (this.props.config.layoutType === 'fixedWidth') {
                targetMap.start = source.start;
                targetMap.end = source.end;
            } else if (this.props.config.layoutType === 'delimited') {
                targetMap.position = source.position;
            }
        } else {
            // add new mapping
            const newMap: any = { name: targetColumn };
            if (defaultValue) {
                newMap.default = defaultValue;
            }
            if (this.props.config.layoutType === 'fixedWidth') {
                newMap.start = source.start;
                newMap.end = source.end;
            } else if (this.props.config.layoutType === 'delimited') {
                newMap.position = source.position;
            }
            directMapping.push(newMap);
        }

        this.setState({ directMapping, showAddMappingForm: false });
    }
    public onSave(event) {
        directMappingActions.updateDirectMapping(this.props.config, this.state.directMapping);
        this.props.onSave(this.props.config);
    }
    public showAddMappingForm() {
        this.setState({ showAddMappingForm: true });
    }
    public cancelAddMappingForm() {
        this.setState({ showAddMappingForm: false });
    }
    public render(): JSX.Element {
        const targetColumns = this.props.config.getUnMappedTargetColumns('direct_mapping');
        return (<div>
            <AddButton onClick={this.showAddMappingForm} />
            {this.state.showAddMappingForm &&
                <DirectMappingForm
                    targetColumns={_.map(targetColumns, column => column.name)}
                    sourceLayout={this.props.config.sourceLayout.content}
                    layoutType={this.props.config.layoutType}
                    onSave={this.changeMapping}
                    onCancel={this.cancelAddMappingForm}
                />
            }
            <DirectMappingTable
                targetColumns={targetColumns}
                sourceLayout={this.props.config.sourceLayout.content}
                layoutType={this.props.config.layoutType}
                mapping={this.state.directMapping}
                onChange={this.changeMapping}
            />
            {this.state.directMapping.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}
        </div>);
    }
}
