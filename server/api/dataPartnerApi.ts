import Store from './store';
import * as sql from 'sql.js';

const replaceAll = (str: string, target: string, replacement: string) => {
    return str.split(target).join(replacement);
};

export default {
    getDataPartners: (req, res) => {
        const { accessToken } = req.session;
        const db = new sql.Database();

        Store.instance.getDataPartners(accessToken).then((result) => {
            result = replaceAll(result, 'acp_dictionary.data_partner', 'data_partner');
            // To-Do : swati - Change sqlLite to the database used by acp_ods
            // work around, sqllite does not support ON
            result = replaceAll(result, 'ON UPDATE', '');
            // work around, sqllite does not support IGNORE
            result = replaceAll(result, 'INSERT IGNORE', 'INSERT');
            // remove constraint- because insert statements contain duplicate elements
            result = replaceAll(result, 'CONSTRAINT pk_data_partner PRIMARY KEY (DATA_PARTNER_CD)', '');
            result = replaceAll(result, 'UPDATED_DT DATETIME  CURRENT_TIMESTAMP,', 'UPDATED_DT DATETIME  CURRENT_TIMESTAMP');
            db.run(result);
            const dataPartners = db.exec(`select * from data_partner`);
            db.close();
            return res.json({ dataPartners: dataPartners[0].values });
        }).catch(error => {
            console.log('failed to fetch data partners');
            console.log(error);
            res.status(500).send('failed to fetch data partners');
        });
    }
};
