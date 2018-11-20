import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Backdrop from './Backdrop';

configure({adapter: new Adapter()});

describe('<Backdrop />', () => {
    it('should render nothing when no show prop', () => {
        const wrapper = shallow(<Backdrop/>);

        expect(wrapper.getElement()).toBeNull();
    });

    it('should render div when show prop', () => {
        const wrapper = shallow(<Backdrop show={true} clicked={() => {}}/>);

        expect(wrapper.find('div')).toHaveLength(1);
    });
});