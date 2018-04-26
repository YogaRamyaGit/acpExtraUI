import * as React from 'react';

import { AutoComplete, TextField, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import style from './overpunchStyle';

interface IOverpunchRowProps {
    index: number;
    targetField: string;
    sourceField: string;
    decimalPlaces: number;
    targetColumns: any[];
    onChange: (index: number, overpunchRow: any) => void;
    onRemove: (index: number) => void;
}

interface IOverpunchRowState {
    targetField: string;
    sourceField: string;
    decimalPlaces: number;
}

export default class OverpunchRow extends React.Component<IOverpunchRowProps, IOverpunchRowState> {
    constructor(props, context) {
        super(props, context);

        this.getColumnOptions = this.getColumnOptions.bind(this);
        this.updateTargetField = this.updateTargetField.bind(this);
        this.updateSourceField = this.updateSourceField.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.setDecimalPlaces = this.setDecimalPlaces.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {
            targetField: this.props.targetField || '',
            sourceField: this.props.sourceField || '',
            decimalPlaces: this.props.decimalPlaces
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            targetField: nextProps.targetField || '',
            sourceField: nextProps.sourceField || '',
            decimalPlaces: nextProps.decimalPlaces
        });
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private getColumnOptions() {
        return this.props.targetColumns.map(column => column.name);
    }
    private updateTargetField(targetField) {
        const { sourceField } = this.state;
        this.setState({
            targetField,
            sourceField: (sourceField || targetField)
        });
    }
    private updateSourceField(sourceField) {
        const { targetField } = this.state;
        this.setState({
            sourceField,
            targetField: (targetField || sourceField)
        });
    }
    private updateConfig() {
        const { sourceField, targetField, decimalPlaces } = this.state;
        this.props.onChange(
            this.props.index, {
                sourceField,
                targetField,
                decimalPlaces
            }
        );
    }
    private setDecimalPlaces(event, decimalPlaces) {
        this.setState({ decimalPlaces });
    }
    private onRemove() {
        this.props.onRemove(this.props.index);
    }

    public render(): JSX.Element {
        return (<div style={style.rowContainer}>
            <div className="row">
                <div className="col-md-4">
                    <AutoComplete
                        floatingLabelText="Target Field"
                        floatingLabelFixed={true}
                        searchText={this.state.targetField}
                        onUpdateInput={this.updateTargetField}
                        onBlur={this.updateConfig}
                        dataSource={this.getColumnOptions()}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />
                </div>
                <div className="col-md-4">
                    <AutoComplete
                        floatingLabelText="Source Field"
                        floatingLabelFixed={true}
                        searchText={this.state.sourceField}
                        onUpdateInput={this.updateSourceField}
                        onBlur={this.updateConfig}
                        dataSource={this.getColumnOptions()}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />
                </div>
                <div className="col-md-2">
                    <TextField
                        floatingLabelText="Decimal Places"
                        floatingLabelFixed={true}
                        value={this.state.decimalPlaces}
                        type={'number'}
                        min={0}
                        onChange={this.setDecimalPlaces}
                        onBlur={this.updateConfig}
                        fullWidth={true}
                    />
                </div>
                <div className="col-md-1">
                    <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                        <ClearIcon />
                    </IconButton>
                </div>
            </div>
        </div>);
    }
}
