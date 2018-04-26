import * as React from 'react';
import { assign } from 'lodash';

import { Card, CardText } from 'material-ui/Card';

import { IConfig } from '../configs/config';
import LayoutConfiguration from './layoutConfiguration/layoutConfiguration';
import SourceLayout from './sourceLayout/sourceLayout';
import DirectMapping from './directMapping/directMapping';
import DefaultValue from './defaultValue/defaultValue';
import TargetTables from './targetTables/targetTables';
import SQLExpression from './sqlExpression/sqlExpression';
import PivotConfigs from './pivotConfigs/pivotConfigs';
import Multiparam from './multiparam/multiparam';
import BusinessRule from './businessRule/businessRule';

import style from './editConfigStepStyle';

interface IEditableConfigStepProps {
    sidebarOpen: boolean;
    currentStep: any;
    editableConfig: IConfig;
    allTables: string[];
    allBusinessRules: any[];
    onSave: (IConfig) => void;
    onRemove?: (filter: any) => void;
}

export default class EditableConfigStep extends React.Component<IEditableConfigStepProps, null> {
    constructor(props, context) {
        super(props, context);

        this.onRemove = this.onRemove.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.getContainerStyle = this.getContainerStyle.bind(this);
    }
    private onRemove() {
        this.props.onRemove(this.props.currentStep);
    }
    private getStepContent() {
        const { currentStep } = this.props;
        const props = {
            config: this.props.editableConfig,
            onSave: this.props.onSave,
            onRemove: this.onRemove
        };
        switch (currentStep.type) {
            case 'layout-configuration':
                return <LayoutConfiguration {...props} />;
            case 'target-tables':
                return <TargetTables allTables={this.props.allTables} {...props} />;
            case 'source-layout':
                return <SourceLayout {...props} />;
            case 'direct-mapping':
                return <DirectMapping {...props} />;
            case 'default_value':
                return <DefaultValue index={currentStep.index} {...props} />;
            case 'sql_expression':
                return <SQLExpression index={currentStep.index} {...props} />;
            case 'pivot-config':
                return <PivotConfigs {...props} />;
            case 'multiparam':
                return <Multiparam index={currentStep.index} {...props} />;
            case 'business-rules':
                return <BusinessRule allBusinessRules={this.props.allBusinessRules} {...props} />;

            default:
                return <div><h3>Coming Soon!</h3></div>;
        }
    }
    private getContainerStyle() {
        return this.props.sidebarOpen ? assign({}, style.container, style.sidebarOpen) : assign({}, style.container, style.sidebarClose);
    }
    public render(): JSX.Element {
        return (<div style={this.getContainerStyle()}>
            <Card containerStyle={style.card}>
                <div>
                    {this.getStepContent()}
                </div>
            </Card>
        </div>);
    }
}
