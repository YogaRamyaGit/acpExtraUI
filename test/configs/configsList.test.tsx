import * as React from 'react';
import * as _ from 'lodash';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import * as expect from 'expect';
import toJson, { createSerializer } from 'enzyme-to-json';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import Config, { IConfig } from '../../src/configs/config';
import ConfigsList from '../../src/configs/configsList';
import ConfigRow from '../../src/configs/configRow';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableRowColumn
} from 'material-ui';

expect.addSnapshotSerializer(createSerializer({ noKey: false, mode: 'deep' }));

describe('Configs list', () => {
    let component: any;
    let configs: IConfig[] = [];
    let onEdit;
    let onCopy;
    beforeEach(() => {
        configs = [
            new Config({ dataPartner: 'Test', feedType: 'feed1', name: 'test_feed1.cfg' }),
            new Config({ dataPartner: 'Test', feedType: 'feed2', name: 'test_feed2.cfg' }),
            new Config({ dataPartner: 'Test2', feedType: 'feed3', subType: 'subType', name: 'test2_feed3_subtype.cfg' })
        ];
        onEdit = sinon.spy();
        onCopy = sinon.spy();
        component = mount(<MuiThemeProvider>
            <ConfigsList configs={configs} onEdit={onEdit} onCopy={onCopy} />
        </MuiThemeProvider>);
    });

    it('homepage should present', () => {
        expect(component).toBeDefined();
    });

    it('shows a list config files', () => {
        expect(component.find(Table).length).toEqual(1);
        expect(component.find(TableHeader).length).toEqual(1);
        expect(component.find(TableHeader).find(TableRow).length).toEqual(1);

        expect(component.find(TableBody).length).toEqual(1);
        expect(component.find(TableBody).find(ConfigRow).length).toEqual(3);
    });

    it('matches the snapshot', () => {
        // expect(toJson(component)).toMatchSnapshot();
    });
});
