import { ReactWrapper } from 'enzyme'
import { computed } from 'mobx'
import * as React from 'react'

import enzyme from './enzyme'
import { observer } from './observer'

afterEach(() => enzyme.unmountAll())

type AnyProps = { [key: string]: any }

describe('SFC', () => {
  let render: React.ComponentType<AnyProps>

  beforeEach(() => {
    render = jest.fn(({ used }) => <p>{used}</p>)
  })

  describe('without @observer', () => {
    let component: ReactWrapper

    beforeEach(() => {
      const Component = render
      component = enzyme.mount(<Component used="a" ignored="x" />)
    })

    test('called once upon construction', () => {
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('called when no prop changed', () => {
      component.setProps({})
      component.setProps({})
      expect(render).toHaveBeenCalledTimes(3)
    })

    test('called when used prop assigned but not changed', () => {
      component.setProps({ used: 'a' })
      expect(render).toHaveBeenCalledTimes(2)
    })

    test('called when ignored prop changed', () => {
      component.setProps({ ignored: 'y' })
      expect(render).toHaveBeenCalledTimes(2)
    })
  })

  describe('with @observer', () => {
    let component: ReactWrapper

    beforeEach(() => {
      const Component: React.ComponentType<any> = observer(render)
      component = enzyme.mount(<Component used="a" ignored="x" />)
    })

    test('called once upon construction', () => {
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('not called when no prop changed', () => {
      component.setProps({})
      component.setProps({})
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('called when used prop changed', () => {
      component.setProps({ used: 'b' })
      expect(render).toHaveBeenCalledTimes(2)
    })

    test('not called when used prop assigned but not changed', () => {
      component.setProps({ used: 'a' })
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('not called when ignored prop changed', () => {
      component.setProps({ ignored: 'y' })
      expect(render).toHaveBeenCalledTimes(1)
    })
  })
})

describe('class component', () => {
  let render: React.ComponentType<AnyProps>
  let Component: React.ComponentType<AnyProps>

  beforeEach(() => {
    render = jest.fn(function(this: {used: string}) {
      return <p>{this.used}</p>
    })

    class _Component extends React.Component<any> {
      @computed
      // @ts-ignore
      private get used() {
        return this.props.object.used
      }

      public readonly render = render as () => React.ReactNode
    }

    Component = _Component
  })

  describe('without @observer', () => {
    let component: ReactWrapper

    beforeEach(() => {
      component = enzyme.mount(
        <Component object={{ used: 'a', ignored: 'x' }} />,
      )
    })

    test('called once upon construction', () => {
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('called when no prop changed', () => {
      component.setProps({})
      component.setProps({})
      expect(render).toHaveBeenCalledTimes(3)
    })

    test('called when used nested prop changed', () => {
      component.setProps({ object: { used: 'b' } })
      expect(render).toHaveBeenCalledTimes(2)
    })

    test('called when object prop assigned but not changed', () => {
      component.setProps({ object: { used: 'a', ignored: 'x' } })
      expect(render).toHaveBeenCalledTimes(2)
    })

    test('called when ignored nested prop changed', () => {
      component.setProps({ object: { used: 'a', ignored: 'y' } })
      expect(render).toHaveBeenCalledTimes(2)
    })
  })

  describe('with @observer', () => {
    let component: ReactWrapper

    beforeEach(() => {
      Component = observer(Component)
      component = enzyme.mount(
        <Component object={{ used: 'a', ignored: 'x' }} />,
      )
    })

    test('called once upon construction', () => {
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('not called when no prop changed', () => {
      component.setProps({})
      component.setProps({})
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('called when used nested prop changed', () => {
      component.setProps({ object: { used: 'b' } })
      expect(render).toHaveBeenCalledTimes(2)
    })

    test('not called when object prop assigned but not changed', () => {
      component.setProps({ object: { used: 'a', ignored: 'x' } })
      expect(render).toHaveBeenCalledTimes(1)
    })

    test('not called when ignored nested prop changed', () => {
      component.setProps({ object: { used: 'a', ignored: 'y' } })
      expect(render).toHaveBeenCalledTimes(1)
    })
  })
})
