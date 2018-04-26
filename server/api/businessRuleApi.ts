import Store from './store';

export default {
    getBusinessRules: (req, res) => {
        const { accessToken } = req.session;
        Store.instance.getBusinessRules(accessToken)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => {
                console.log('error: ', error);
                res.status(500).send('failed to fetch business rules');
            });
    }
};

