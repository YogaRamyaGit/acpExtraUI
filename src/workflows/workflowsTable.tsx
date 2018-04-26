import * as React from 'react';
import { map, filter } from 'lodash';
import Workflow, { IWorkflow } from './workflow';
import TableWidget, { IHeader, IAction } from '../common/tableWidget/tableWidget';

interface IWorkflowTableProps {
    workflows: IWorkflow[];
    onEdit: (workflow) => void;
}

const WorkflowsTable = (props: IWorkflowTableProps): JSX.Element => {
    const headers: IHeader[] = [
        { title: 'Partner', value: 'dataPartner' },
        { title: 'Feed', value: 'feedType' },
        { title: 'Name', value: 'name' }
    ];

    const actions: IAction[] = [{
        title: 'Edit',
        onClick: props.onEdit
    }];

    const rows = filter(props.workflows, (workflow, index) => {
        return (workflow.dataPartner && workflow.feedType);
    });

    return (
        <TableWidget headers={headers} rows={rows} actions={actions} />
    );
};

export default WorkflowsTable;

