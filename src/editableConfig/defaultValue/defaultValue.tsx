import * as React from 'react';
import { keys, values, includes, indexOf, isEqual, map, reduce } from 'lodash';
import { IConfig } from '../../configs/config';
import { AddButton, RemoveButton } from '../common';

import ActionButtons from '../editableConfigActionButtons';
import DefaultValueTable from './defaultValueTable';
import * as defaultValueActions from './defaultValueActions';
import style from './defaultValueStyle';

interface IEditConfigProps {
    config: IConfig;
    index?: number;
    onSave: (any) => void;
    onRemove: () => void;
}

interface IDefaultValueState {
    defaultValues: any;
}

export default class DefaultValue extends React.Component<IEditConfigProps, IDefaultValueState> {
    constructor(props, context) {
        super(props, context);

        this.updateDefaultValue = this.updateDefaultValue.bind(this);
        this.onSave = this.onSave.bind(this);
        this.showNewForm = this.showNewForm.bind(this);
        this.removeFilter = this.removeFilter.bind(this);

        this.state = {
            defaultValues: this.props.config.getFilter('default_value', this.props.index) || {}
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            defaultValues: nextProps.config.getFilter('default_value', nextProps.index) || {}
        });
    }
    public onSave(event) {
        defaultValueActions.updateDefaultValues(this.props.config, this.state.defaultValues, this.props.index);
        this.props.onSave(this.props.config);
    }
    private removeFilter() {
        this.props.onRemove();
    }
    public updateDefaultValue(targetColumn: string, defaultValue: any) {
        let { defaultValues } = this.state;
        const currentKeys = keys(defaultValues);
        const currentIndex = indexOf(currentKeys, targetColumn);
        if (isEqual(defaultValue, {})) {
            // remove the key
            if (currentIndex >= 0) {
                delete defaultValues[targetColumn];
            }

            this.setState({ defaultValues });
            return;
        }

        // format the record to process as an array
        const formattedValues = map(defaultValues, (val: string, k: string) => {
            return { key: k, value: val };
        });

        const key = keys(defaultValue)[0];
        const value = values(defaultValue)[0];

        if (currentIndex >= 0) {
            // update the record;
            formattedValues[currentIndex] = { key, value };
            // re-construct default values
            defaultValues = reduce(formattedValues, (result, val: any) => {
                result[val.key] = val.value;
                return result;
            }, {});
        } else {
            defaultValues[key] = value;
        }
        this.setState({ defaultValues });
    }
    public showNewForm() {
        const { defaultValues } = this.state;
        if (!includes(keys(defaultValues), "")) {
            defaultValues[""] = "";
        }

        this.setState({ defaultValues });
    }
    public render(): JSX.Element {
        const targetColumns = this.props.config.getUnmappedColumns('default_value', this.props.index);
        return (<div>
            <div style={style.buttonsContainer}>
                <AddButton onClick={this.showNewForm} />
                <RemoveButton onClick={this.removeFilter} />
            </div>

            <DefaultValueTable
                targetColumns={this.props.config.uniqTargetColumns}
                unMappedTargetColumns={targetColumns}
                mapping={this.props.config.directMapping}
                defaultValues={this.state.defaultValues}
                onChange={this.updateDefaultValue}
            />

            {keys(this.state.defaultValues).length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}
        </div>);
    }
}
