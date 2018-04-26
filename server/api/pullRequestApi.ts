import Store from './store';

export default {
    getPullRequests: (req, res) => {
        const { accessToken } = req.session;
        const state = req.query.state || 'open';
        const sortBy = 'updated';
        const direction = 'desc';
        try {
            Store.instance.getPullRequests(accessToken, state, sortBy, direction)
                .then((pullRequests) => {
                    res.json(pullRequests);
                })
                .catch((error) => {
                    console.log('error: ', error);
                    res.status(500).send('Failed to fetch pull requests');
                });
        } catch (error) {
            res.status(500).send(error.message);
        }

    },
    createPullRequest: (req, res) => {
        const { branch } = req.body;
        const { accessToken } = req.session;

        try {
            Store.instance.createPullRequest(
                accessToken,
                branch
            )
                .then((result: any) => { res.json(result); })
                .catch((error) => { console.log(error); res.status(500).send('Failed to publish config'); });
        } catch (error) {
            console.log(error);
            res.status(500).send('Failed to publish config');
        }
    },
    updatePullRequest: (req, res) => {
        const { branch, prId, prState } = req.body;
        const { accessToken } = req.session;

        try {
            Store.instance.updatePullRequest(
                accessToken,
                branch,
                prId,
                prState
            )
                .then((result: any) => { res.json(result); })
                .catch((error) => { console.log(error); res.status(500).send('Failed to publish config'); });
        } catch (error) {
            console.log(error);
            res.status(500).send('Failed to publish config');
        }
    }
};