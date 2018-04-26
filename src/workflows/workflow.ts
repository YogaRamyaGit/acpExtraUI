export interface IWorkflow {
    dataPartner?: string;
    feedType?: string;
    subType?: string;
    sha?: string;
    path?: string;
    content?: string;
    name?: string;
    processLogs?: any;
}

export default class Workflow {
    private _logs: any;
    constructor(workflow: IWorkflow) {
        for (const name in workflow) {
            if (workflow.hasOwnProperty(name)) {
                this[name] = workflow[name];
            }
        }
    }

    public get processLogs(): any {
        return this._logs || null;
    }

    public set processLogs(logs: any) {
        this._logs = logs;
    }
}
