import * as React from 'react';
import * as _ from 'lodash';

import { AutoComplete } from 'material-ui';

interface ITargetTableFormProps {
    options: string[];
    onAdd: (tableName: string) => void;
}

interface ITargetTableFormState {
    searchText: string;
}

export default class AddTargetTableForm extends React.Component<ITargetTableFormProps, ITargetTableFormState> {
    constructor(props, context) {
        super(props, context);

        this.updateInput = this.updateInput.bind(this);
        this.addNew = this.addNew.bind(this);

        this.state = {
            searchText: ''
        };
    }
    private filter(searchText, key) {
        return (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
    private updateInput(searchText: string, dataSource: string[], params: any) {
        this.setState({ searchText });
    }
    private addNew(table, index) {
        this.props.onAdd(table);

        this.setState({ searchText: '' });
    }
    public render(): JSX.Element {
        return (<div>
            <AutoComplete
                floatingLabelText="Target Tables"
                floatingLabelFixed={true}
                hintText="Add new"
                searchText={this.state.searchText}
                onUpdateInput={this.updateInput}
                onNewRequest={this.addNew}
                dataSource={this.props.options}
                filter={this.filter}
                openOnFocus={true}
            />
        </div>);
    }
}
