import * as React from 'react';
import { map, difference, includes, remove } from 'lodash';
import { AutoComplete, Chip } from 'material-ui';

interface IAddTagsProps {
    title?: string;
    tags: string[];
    tagOptions: string[];
    onAdd: (tagName: string) => void;
    onRemove: (tagName: string) => void;
}

interface IAddTagsState {
    tags: string[];
    searchText: string;
}

const style: {[key: string]: React.CSSProperties} = {
    fieldChip: { display: 'inline-flex', margin: '2px 5px', verticalAlign: 'middle' },
    autoComplete: { margin: '0 5px' },
    fieldsContainer: {
        padding: '5px 0',
        border: '1px solid rgb(166, 201, 226)',
        backgroundColor: 'rgb(252, 253, 253)',
        borderRadius: 7
    },
    label: {
        color: 'rgba(0, 0, 0, 0.3)'
    }
};

export default class TagsManager extends React.Component<IAddTagsProps, IAddTagsState> {
    constructor(props, context) {
        super(props, context);

        this.updateValue = this.updateValue.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.getTagOptions = this.getTagOptions.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.removeTag = this.removeTag.bind(this);

        this.state = {
            tags: this.props.tags || [],
            searchText: ''
        };
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            tags: nextProps.tags || []
        });
    }

    private filterOptions(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private updateValue(searchText) {
        this.setState({ searchText });
    }
    private updateTags() {
        const { tags, searchText } = this.state;

        tags.push(searchText);
        this.setState({ tags, searchText: '' });
        this.props.onAdd(searchText);
    }
    private getTagOptions() {
        return difference(this.props.tagOptions, this.state.tags);
    }
    private onKeyUp(event) {
        const endKeys = [32];

        if (includes(endKeys, event.keyCode)) {
            this.updateTags();
        }
    }
    private removeTag(tag) {
        const { tags } = this.state;

        remove(tags, item => item === tag);
        this.setState({ tags });
        this.props.onRemove(tag);
    }

    public render(): JSX.Element {
        return <div>
            <label style={style.label}>{this.props.title || 'Tags'}</label>
            <div style={style.fieldsContainer}>
                {map(this.state.tags, (tag, index) => {
                    return <Chip key={index} style={style.fieldChip} onRequestDelete={() => this.removeTag(tag)}>{tag}</Chip>;
                })}
                <AutoComplete
                    style={style.autoComplete}
                    hintText="Add New"
                    searchText={this.state.searchText}
                    onUpdateInput={this.updateValue}
                    onNewRequest={this.updateTags}
                    dataSource={this.getTagOptions()}
                    filter={this.filterOptions}
                    openOnFocus={true}
                    onKeyUp={this.onKeyUp}
                />
            </div>
        </div>;
    }
}
