import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';

import observable from './index';
import { useObservable } from './react';


Enzyme.configure({ adapter: new Adapter() });


describe('React', () => {
  let clickObservable,
      MyComponent;

  beforeEach(() => {
    clickObservable = observable(0);

    const Component = () => {
      const [clickCount, setClickCount] = useObservable(clickObservable);

      const onClick = () => setClickCount(previous => previous + 1);

      return <button type='button' onClick={onClick}>{ `${clickCount} clicks` }</button>;
    };

    MyComponent = Component;
  });


  test('Should render', () => {
    const component = mount(<MyComponent />);

    expect(component.text()).toEqual('0 clicks');
  });

  test('Should render initial value', () => {
    clickObservable.set(99);

    const component = mount(<MyComponent />);

    expect(component.text()).toEqual('99 clicks');
  });

  test('Should render after external update', () => {
    const component = mount(<MyComponent />);

    act(() => {
      clickObservable.set(10);
    });

    expect(component.text()).toEqual('10 clicks');
  });

  test('Should render after internal update', () => {
    const component = mount(<MyComponent />);

    act(() => {
      component.simulate('click');
      component.simulate('click');
    });

    expect(component.text()).toEqual('2 clicks');
  });
});
