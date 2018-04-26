import * as React from 'react';
import { find } from 'lodash';
import helper from '../helper';
import PRInfo from './prInfo';
import { RaisedButton, IconButton, Chip, Popover, PopoverAnimationVertical } from 'material-ui';
import ViewIcon from 'material-ui/svg-icons/action/visibility';
import PublishIcon from 'material-ui/svg-icons/action/done';
import RunIcon from 'material-ui/svg-icons/av/play-arrow';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import theme from '../theme';

const style: { [key: string]: React.CSSProperties } = {
    header: {
        padding: 15,
        borderBottom: '2px solid #009688',
        display: 'flex' as 'flex',
        justifyContent: 'space-between' as 'space-between',
        position: 'fixed',
        width: '100%',
        top: theme.appBar.height,
        backgroundColor: theme.palette.accent1Color,
        zIndex: 1100
    },
    infoContainer: {
        display: 'flex' as 'flex',
        justifyContent: 'space-between' as 'space-between',
        padding: '5px 0'
    },
    configInfo: {
        margin: '0 20px'
    },
    branchName: {
        fontSize: 18
    },
    small: {
        width: 22,
        height: 22,
        padding: 0
    },
    smallIcon: {
        width: 20,
        height: 20,
    },
    menuButton: {
        margin: '0 10px'
    },
    buttons: { display: 'flex' as 'flex', justifyContent: 'space-between' as 'space-between' },
    publishButton: { margin: '0 10px' }
};

interface IBranchInfoProps {
    currentBranch: any;
    dataPartner?: string;
    feedType?: string;
    name?: string;
    enableViewFile?: boolean;
    onView?: () => void;
    enablePublishChanges?: boolean;
    onPublish?: () => void;
    showMenu?: boolean;
    onClickMenu?: () => void;
    executable?: boolean;
    onExecute?: () => void;
}

const BranchInfo = (props: IBranchInfoProps): JSX.Element => {
    const pullRequestsPresent = props.currentBranch.pullRequests && props.currentBranch.pullRequests.length > 0;
    const openPR = props.currentBranch.pullRequests && find(props.currentBranch.pullRequests, { state: 'open' });
    const lastMergedPR = props.currentBranch.pullRequests && find(props.currentBranch.pullRequests, (pr) => pr.merged_at);
    return (<div style={style.header}>
        <div style={style.infoContainer}>
            {props.showMenu &&
                <div style={style.menuButton}>
                    <IconButton
                        onClick={props.onClickMenu}
                        iconStyle={style.smallIcon}
                        style={style.small}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            }
            <div style={style.branchName}>{props.currentBranch.name}</div>
            {props.dataPartner && <div style={style.configInfo}>
                <span>{props.dataPartner}</span> | <span>{props.feedType}</span> | <span>{props.name}</span>
            </div>}
        </div>

        <div style={style.buttons}>
            {props.executable && <div>
                <RaisedButton
                    label={"Execute"}
                    primary={true}
                    onClick={props.onExecute}
                    style={style.publishButton}
                    icon={<RunIcon />}
                />
            </div>}
            {pullRequestsPresent && <div>
                <PRInfo
                    openPR={openPR}
                    mergedPR={lastMergedPR}
                    title={"PR Info"}
                />
            </div>}
            {props.enablePublishChanges && <div>
                <RaisedButton
                    label={openPR ? "Update Pull Request" : "Create Pull Request"}
                    primary={true}
                    onClick={props.onPublish}
                    style={style.publishButton}
                    icon={<PublishIcon />}
                />
            </div>}

            {props.enableViewFile && <div>
                <RaisedButton
                    label="View File"
                    primary={true}
                    onClick={props.onView}
                    icon={<ViewIcon />}
                />
            </div>}
        </div>
    </div>);
};

export default BranchInfo;

