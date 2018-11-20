import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Layout} from './Layout';
import Wrapper from '../../../hoc/Wrapper';

configure({adapter: new Adapter()});

describe('<Layout />', () => {
    it('should render content inside transparent wrapper', () => {
        const wrapper = shallow(<Layout>Content</Layout>);

        expect(wrapper.find(Wrapper).html()).toBe('<main>Content</main>');
    });
});