export interface IApp {
    id: string;
    name: string;
    content?: string;
    description?: string;
    redirectTo: string;
}

const apps: IApp[] = [
    {
        id: 'configs-manager',
        name: 'Configs Manager',
        description: 'manage configs',
        content: 'Config manager manages configs in Pegasus_config_test repository. It creates, updates, raises PR.',
        redirectTo: 'configs'
    },
    {
        id: 'workflow-manager',
        name: 'Workflows Manager',
        description: 'manage workflows',
        content: 'Workflow manager manages workflows. It creates workflows from data partner and feed type.',
        redirectTo: 'workflows'
    }
];

export default apps;
