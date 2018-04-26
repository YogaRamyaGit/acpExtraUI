// Utils
let isProduction: boolean = false;
if (process.env.NODE_ENV === 'production' || (process.argv.indexOf('-p') >= 0)) { // If production flag is passed
    isProduction = true;
    process.env.NODE_ENV = 'production';
}

let config: any = {};
if (isProduction) {
    config = {
        authUrl: 'https://github.com/login/oauth/authorize',
        redirectUri: 'loginsuccess',
        scope: 'repo',
        state: '1234abcd',
        repoOwner: 'konciergeMD', // 'swatis-unify',
        repoName: 'pegasus_config_test',
        sourcePath: 'acp_extra/partner_conf',
        feedConfigPath: 'acp_extra/feed_conf',
        sourceLayoutPath: 'sourceLayout',
        baseBranch: 'develop',
        allowSignup: false,
        dbConfig: {
            repoOwner: 'konciergeMD', // 'swatis-unify',
            repoName: 'acp-ods',
            columnsPath: 'acp_lz/tables',
            dataPartnerPath: 'acp_dictionary',
            feedTypePath: 'acp_dictionary'
        },
        businessRuleConfig: {
            repoOwner: 'konciergeMD',
            repoName: 'acp-ExTra',
            baseBranch: 'develop',
            path: 'conf/business_rules.cfg'
        },
        workflowConfig: {
            repoOwner: 'konciergeMD',
            repoName: 'pegasus_config_test',
            path: 'acp-workflow/metadata/sql',
            baseBranch: 'develop'
        },
        clusterConfig: {
            userName: 'hadoop',
            host: 'emr-pegasus.test.accint.io',
            path: '/home/hadoop/acp-extra-ui/pegasus_config/acp_extra/partner_conf/',
            configDirectory: '/home/hadoop/acp-extra-ui/pegasus_config/acp_extra',
            workflowRunner: 'cd /etc/pegasus/acp-workflow; ./pipeline_exec.sh'
        }
    };
} else {
    config = {
        authUrl: 'https://github.com/login/oauth/authorize',
        redirectUri: 'loginsuccess',
        scope: 'repo',
        state: '1234abcd',
        repoOwner: 'konciergeMD', // 'swatis-unify',
        repoName: 'pegasus_config_test',
        sourcePath: 'acp_extra/partner_conf',
        feedConfigPath: 'acp_extra/feed_conf',
        sourceLayoutPath: 'sourceLayout',
        baseBranch: 'develop',
        allowSignup: false,
        dbConfig: {
            repoOwner: 'konciergeMD', // 'swatis-unify',
            repoName: 'acp-ods',
            columnsPath: 'acp_lz/tables',
            dataPartnerPath: 'acp_dictionary',
            feedTypePath: 'acp_dictionary'
        },
        businessRuleConfig: {
            repoOwner: 'konciergeMD',
            repoName: 'acp-ExTra',
            baseBranch: 'develop',
            path: 'conf/business_rules.cfg'
        },
        workflowConfig: {
            repoOwner: 'konciergeMD',
            repoName: 'pegasus_config_test',
            path: 'acp-workflow/metadata/sql',
            baseBranch: 'develop'
        },
        clusterConfig: {
            userName: 'hadoop',
            host: 'emr-pegasus.test.accint.io',
            path: '/home/hadoop/acp-extra-ui/pegasus_config/acp_extra/partner_conf/',
            configDirectory: '/home/hadoop/acp-extra-ui/pegasus_config/acp_extra',
            workflowRunner: 'cd /etc/pegasus/acp-workflow; ./pipeline_exec.sh'
        }
    };
}
export default config;
