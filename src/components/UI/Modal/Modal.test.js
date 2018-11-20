import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Modal from './Modal';
import Wrapper from '../../../hoc/Wrapper';

configure({adapter: new Adapter()});

describe('<Modal />', () => {
    it('should render content inside transparent wrapper without backdrop', () => {
        const wrapper = shallow(<Modal>Wow</Modal>);

        expect(wrapper.find('div').html()).toBe('<div style="transform:translateY(-100vh);opacity:0">Wow</div>');
    });

    it('should render content inside transparent wrapper with backdrop', () => {
        const wrapper = shallow(<Modal show={true} modalClosed={() => {}}>Wow</Modal>);

        expect(wrapper.find(Wrapper).html()).toBe('<div></div><div style="transform:translateY(0);opacity:1">Wow</div>');
    });
});