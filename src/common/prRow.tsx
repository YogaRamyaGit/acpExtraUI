import * as React from 'react';
import { IconButton, TextField, Chip } from 'material-ui';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';

import * as copy from 'copy-to-clipboard';

interface IPRRowProps {
    pr: any;
}
const style: { [key: string]: React.CSSProperties } = {
    rowContainer: { margin: '5px 0' },
    linkContainer: { display: 'flex' as 'flex', justifyContent: 'space-between' as 'space-between' },
    link: { width: 450 },
    tagsContainer: { display: 'flex' },
    tag: { margin: '0 5px' },
};

const colors: any = {
    open: '#2cbe4e',
    closed: 'red',
    merged: '#6f42c1',
    chipColor: '#fff'
}

export default class PRRow extends React.Component<IPRRowProps, null> {
    constructor(props, context) {
        super(props, context);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.isPrOpen = this.isPrOpen.bind(this);
        this.isPrMerged = this.isPrMerged.bind(this);
    }
    private copyToClipboard() {
        copy(this.props.pr.html_url);
    }
    private isPrOpen(): boolean {
        return this.props.pr.state === 'open';
    }
    private isPrMerged(): boolean {
        return this.props.pr.merged_at;
    }
    public render(): JSX.Element {
        return (
            <div style={style.rowContainer}>
                <div style={style.tagsContainer}>
                    {!this.isPrMerged() && <Chip style={style.tag} labelColor={colors.chipColor} backgroundColor={colors[this.props.pr.state]}>{this.props.pr.state}</Chip>}
                    {this.isPrMerged() && <Chip style={style.tag} labelColor={colors.chipColor} backgroundColor={colors.merged}>merged</Chip>}
                </div>
                <div style={style.linkContainer}>
                    <div style={style.link}>
                        <TextField fullWidth={true} name={"pr_link"} value={this.props.pr.html_url} readOnly={true} />
                    </div>
                    <div>
                        <IconButton onClick={this.copyToClipboard}>
                            <CopyIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}
