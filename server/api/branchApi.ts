import Store from './store';

export default {
    getConfigBranches: (req, res) => {
        const { accessToken } = req.session;
        Store.instance.getConfigBranches(accessToken)
            .then((branches) => {
                res.json(branches);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.status(500).send('failed to fetch branches');
            });
    },
    getWorkflowBranches: (req, res) => {
        const { accessToken } = req.session;
        Store.instance.getWorkflowBranches(accessToken)
            .then((branches) => {
                res.json(branches);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.status(500).send('failed to fetch branches');
            });
    },
    createBranch: (req, res) => {
        const { branch } = req.body;
        const baseBranch = Store.instance.baseBranchSha;
        const { accessToken } = req.session;

        Store.instance.createBranch(accessToken, branch, baseBranch)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.status(500).send('failed to create branch');
            });
    },
    createWorkflowBranch: (req, res) => {
        const { branch } = req.body;
        const baseBranch = Store.instance.baseBranchSha;
        const { accessToken } = req.session;

        Store.instance.createWorkflowBranch(accessToken, branch, baseBranch)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.status(500).send('failed to create branch');
            });
    }
};
