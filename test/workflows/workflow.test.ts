import * as expect from 'expect';
import Workflow, { IWorkflow } from '../../src/workflows/workflow';

describe('Workflow', () => {
    let workflow: Workflow;
    beforeEach(() => {
        workflow = new Workflow({ dataPartner: 'Test', feedType: 'feed' });
    });

    it('is defined', () => {
        expect(workflow).toBeDefined();
    });
});

