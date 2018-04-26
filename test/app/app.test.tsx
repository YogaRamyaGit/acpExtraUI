import * as React from 'react';
import * as _ from 'lodash';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import * as expect from 'expect';
import App from '../../src/app/app';

describe('App', () => {
    let component: any;
    beforeEach(() => {
        component = mount(<App />);
    });

    xit('App should be present', () => {
        expect(component).toBeDefined();
    });
});
