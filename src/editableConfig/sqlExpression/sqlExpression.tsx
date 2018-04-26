import * as React from 'react';
import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

import { Divider } from 'material-ui';
import ActionButtons from '../editableConfigActionButtons';
import * as sqlExpressionActions from './sqlExpressionActions';
import SQLExpressionRow from './sqlExpressionRow';
import { AddButton, RemoveButton } from '../common';
import style from './sqlExpressionStyle';

interface IEditConfigProps {
    config: IConfig;
    index?: number;
    onSave: (any) => void;
    onRemove: () => void;
}

interface ISQLExpression {
    expr?: string;
    targetfieldname?: string;
}

interface ISQLExpressionState {
    sqlExpressions: ISQLExpression[];
}

export default class SQLExpression extends React.Component<IEditConfigProps, ISQLExpressionState> {
    private allTargetColumns: string[];
    constructor(props, context) {
        super(props, context);

        this.updateExpression = this.updateExpression.bind(this);
        this.removeExpression = this.removeExpression.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.onSave = this.onSave.bind(this);
        this.showNewForm = this.showNewForm.bind(this);
        this.getTargetColumns = this.getTargetColumns.bind(this);
        this.initTargetColumns = this.initTargetColumns.bind(this);

        this.state = {
            sqlExpressions: this.props.config.getFilter('sql_expression', this.props.index) || []
        };

        // initialize all target columns
        this.initTargetColumns();
    }
    private initTargetColumns() {
        this.allTargetColumns = _.map(this.props.config.uniqTargetColumns, column => column.name);
        // add local variables as well
        _.forEach(this.props.config.getMappedValues('sql_expression', this.props.index), column => {
            if (!_.includes(this.allTargetColumns, column)) {
                this.allTargetColumns.push(column);
            }
        });
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            sqlExpressions: nextProps.config.getFilter('sql_expression', nextProps.index) || []
        });
    }
    public removeExpression(targetField: string) {
        const { sqlExpressions } = this.state;
        const index = _.findIndex(sqlExpressions, expression => expression.targetfieldname === targetField);

        if (index >= 0) {
            sqlExpressions.splice(index, 1);
        }
        this.setState({ sqlExpressions });
    }
    public updateExpression(targetField, updatedTragetField, expr) {
        const { sqlExpressions } = this.state;

        const index = _.findIndex(sqlExpressions, expression => expression.targetfieldname === targetField);

        if (index >= 0) {
            sqlExpressions[index] = {
                expr: expr,
                targetfieldname: updatedTragetField
            };
        } else {
            sqlExpressions.push({
                expr: expr,
                targetfieldname: updatedTragetField
            });
        }

        this.setState({ sqlExpressions });
    }
    public onSave(event) {
        sqlExpressionActions.updateSqlExpressions(this.props.config, this.state.sqlExpressions, this.props.index);
        this.props.onSave(this.props.config);
    }
    private removeFilter() {
        this.props.onRemove();
    }
    private getTargetColumns(targetField: string) {
        const mappedTargetColumns = _.map(this.state.sqlExpressions, expression => expression.targetfieldname);

        return _.concat(_.difference(this.allTargetColumns, mappedTargetColumns), [targetField]);
    }
    public showNewForm() {
        const { sqlExpressions } = this.state;
        if (!_.find(sqlExpressions, { targetfieldname: '' })) {
            sqlExpressions.unshift({
                targetfieldname: '',
                expr: ''
            });
        }

        this.setState({ sqlExpressions });
    }
    public render(): JSX.Element {
        return (<div>
            <div style={style.buttonsContainer}>
                <AddButton onClick={this.showNewForm} />
                <RemoveButton onClick={this.removeFilter} />
            </div>

            <div>
                {_.map(this.state.sqlExpressions, (expression, index) => {
                    return <SQLExpressionRow
                        key={index}
                        targetColumns={this.getTargetColumns(expression.targetfieldname)}
                        {...expression}
                        onChange={this.updateExpression}
                        onRemove={this.removeExpression}
                    />;
                })}
            </div>

            {this.state.sqlExpressions.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />}
        </div>);
    }
}
