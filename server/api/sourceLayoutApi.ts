import Store from './store';

export default {
    updateSourceLayout: (req, res) => {
        const { contents, sha, branch, name } = req.body;
        const { accessToken } = req.session;

        try {
            Store.instance.updateSourceLayout(
                accessToken,
                name,
                branch,
                contents,
                sha
            )
                .then((result: any) => { res.json(result.content); })
                .catch((error) => { console.log('update failed', error); res.status(500).send('Failed to update source layout'); });
        } catch (error) {
            console.log('update failed outside', error);
            res.status(500).send('Failed to update source layout');
        }
    },
    getSourceLayout: (req, res) => {
        const name = req.query.name;
        const branch = req.query.branch;
        const { accessToken } = req.session;

        Store.instance.getSourceLayout(accessToken, name, branch)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                if (res.statusCode === 200) {
                    res.status(404).send('No such source layout');
                } else {
                    res.status(500).send('failed to fetch source layout');
                }
            });
    }
};
