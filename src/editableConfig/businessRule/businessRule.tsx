import * as  React from 'react';
import { map, find, reduce, indexOf, difference } from 'lodash';
import { IConfig } from '../../configs/config';
import BusinessRuleRow from './businessRuleRow';

import ActionButtons from '../editableConfigActionButtons';
import * as businessRuleActions from './businessRuleActions';
import { AddButton } from '../common';

interface IBusinessRuleProps {
    config: IConfig;
    allBusinessRules: any[];
    onSave: (any) => void;
}

interface IRule {
    name: string;
    rule: any;
}

interface IBusinessRuleState {
    businessRules: IRule[];
}
export default class BusinessRule extends React.Component<IBusinessRuleProps, IBusinessRuleState> {
    private targetColumns: any[] = [];
    constructor(props, context) {
        super(props, context);

        const businessRules = map((this.props.config.businessRules || {}), (ruleInfo: any, ruleName: string) => {
            return { name: ruleName, rule: ruleInfo };
        });

        this.updateRule = this.updateRule.bind(this);
        this.removeRule = this.removeRule.bind(this);
        this.getRules = this.getRules.bind(this);
        this.initTargetColumns = this.initTargetColumns.bind(this);
        this.onSave = this.onSave.bind(this);
        this.showNewForm = this.showNewForm.bind(this);

        this.initTargetColumns(this.props.config);

        this.state = {
            businessRules
        };
    }
    public componentWillReceiveProps(nextProps) {
        const businessRules = map((nextProps.config.businessRules || {}), (ruleInfo: any, ruleName: string) => {
            return { name: ruleName, rule: ruleInfo };
        });

        this.targetColumns = nextProps.config.uniqTargetColumns;
        this.initTargetColumns(nextProps.config);

        this.setState({
            businessRules
        });
    }
    private initTargetColumns(config: IConfig) {
        this.targetColumns = config.uniqTargetColumns;
        // add local variables as well
        const mappedColumns: string[] = config.getMappedTargets();
        const localVariables = difference(mappedColumns, this.targetColumns.map(column => column.name));

        localVariables.forEach(column => {
            this.targetColumns.push({
                name: column,
                type: 'string'
            });
        });
    }
    private updateRule(index: number, rule: string, columns: string[]) {
        const { businessRules } = this.state;
        businessRules[index] = { name: rule, rule: { columns } };

        this.setState({ businessRules });
    }
    private removeRule(index: number) {
        const { businessRules } = this.state;
        businessRules.splice(index, 1);

        this.setState({ businessRules });
    }
    private getRules(ruleName) {
        const allMappedRules = map(this.state.businessRules, rule => rule.name);
        return reduce(this.props.allBusinessRules, (result: any[], ruleInfo: any, rule: string) => {
            if (indexOf(allMappedRules, rule) < 0 || rule === ruleName) {
                result.push({ name: rule, rule: ruleInfo });
            }
            return result;
        }, []);
    }
    private onSave() {
        // re-construct business rules
        if (this.state.businessRules.length <= 0) {
            return;
        }

        const businessRules = reduce(this.state.businessRules, (result: any, rule: any) => {
            if (rule.name) {
                result[rule.name] = rule.rule;
            }
            return result;
        }, {});

        businessRuleActions.updateBusinessRules(this.props.config, businessRules);
        this.props.onSave(this.props.config);
    }
    private showNewForm() {
        const { businessRules } = this.state;
        if (!find(businessRules, { name: '' })) {
            businessRules.unshift({
                name: '',
                rule: { columns: [] }
            });
        }

        this.setState({ businessRules });
    }
    public render(): JSX.Element {
        return (<div>
            <AddButton label={"Add Rule"} onClick={this.showNewForm} />

            {map(this.state.businessRules, (ruleInfo: IRule, index: number) => {
                const { name, rule } = ruleInfo;
                return <BusinessRuleRow
                    key={index}
                    rule={name}
                    columns={rule.columns || []}
                    allColumns={this.targetColumns}
                    index={index}
                    allRules={this.getRules(name)}
                    onChange={this.updateRule}
                    onRemove={this.removeRule}
                />;
            })}

            {this.state.businessRules.length > 0 &&
                <ActionButtons
                    onSave={this.onSave}
                />
            }
        </div>);
    }
}
