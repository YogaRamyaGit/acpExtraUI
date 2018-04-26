import * as React from 'react';
import * as _ from 'lodash';

import { SelectField, MenuItem, TextField, IconButton, AutoComplete, Card } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import style from './sqlExpressionStyle';

interface ISQLExpressionRowProps {
    targetColumns: string[];
    targetfieldname?: string;
    expr?: string;
    onChange?: (fieldName: string, updatedFieldName: string, expression: string) => void;
    onRemove: (targetField: string) => void;
}

interface ISQLExpressionRowState {
    targetField: string;
    expression: string;
}

export default class SQLExpressionRow extends React.Component<ISQLExpressionRowProps, ISQLExpressionRowState> {
    constructor(props, context) {
        super(props, context);

        this.chooseTarget = this.chooseTarget.bind(this);
        this.updateTargetField = this.updateTargetField.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.setExpression = this.setExpression.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.state = {
            targetField: this.props.targetfieldname || '',
            expression: this.props.expr || ''
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            targetField: nextProps.targetfieldname || '',
            expression: nextProps.expr || ''
        });
    }
    private chooseTarget(event, index, targetField) {
        this.setState({ targetField });

        this.props.onChange(this.props.targetfieldname, targetField, this.state.expression);
    }
    private updateTargetField(targetField) {
        this.setState({ targetField });
    }
    private updateConfig() {
        this.props.onChange(this.props.targetfieldname, this.state.targetField, this.state.expression);
    }
    private setExpression(event, expression) {
        this.setState({ expression });

        this.props.onChange(this.props.targetfieldname, this.state.targetField, expression);
    }
    private onRemove() {
        this.props.onRemove(this.props.targetfieldname);
    }
    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    public render(): JSX.Element {
        return (<Card containerStyle={style.configCard}>
            <div className="row">
                <div style={style.iconContainer}>
                    <IconButton tooltip="Remove" onClick={this.onRemove} style={style.deleteButton} >
                        <ClearIcon />
                    </IconButton>
                </div>
                <div className="col-md-3">
                    <AutoComplete
                        floatingLabelText="Target Column"
                        floatingLabelFixed={true}
                        searchText={this.state.targetField}
                        onUpdateInput={this.updateTargetField}
                        onBlur={this.updateConfig}
                        dataSource={this.props.targetColumns}
                        filter={this.filterOptions}
                        openOnFocus={true}
                        fullWidth={true}
                    />
                </div>
                <div className="col-md-12">
                    <TextField
                        floatingLabelText="Expression"
                        value={this.state.expression}
                        onChange={this.setExpression}
                        multiLine={true}
                        fullWidth={true}
                    />
                </div>
            </div>
        </Card>);
    }
}
