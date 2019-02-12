# observer

A higher-order component for reactive updates.

[![npm](https://img.shields.io/npm/v/@thejohnfreeman/observer.svg)](https://www.npmjs.com/package/@thejohnfreeman/observer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@thejohnfreeman/observer.svg?style=flat)](https://bundlephobia.com/result?p=@thejohnfreeman/observer)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/observer.svg?branch=master)](https://travis-ci.org/thejohnfreeman/observer)

## What about `mobx-react`?

There are two primary differences between this `observer` higher-order
component (HOC) and [the one of the same
name](https://github.com/mobxjs/mobx-react#observercomponentclass) from
[`mobx-react`](https://github.com/mobxjs/mobx-react). These differences both
serve to simplify the implementation of this HOC.

1. This HOC does not try to add methods to an existing class component and
   return it. Instead, the component class that this HOC returns manages the
   instance of the component type you pass in, instead of letting React manage
   it.

2. This HOC does not try to take an existing React component and make it
   reactive while respecting all the lifecycle methods. Instead, it tries to
   take a component from a specific subset of React components, those with
   only a render method and no lifecycle methods, and make it reactive in the
   most straightforward way.


## Usage

If your component uses all of its props and passes them unchanged to other
components, then it is fine to pass a stateless functional component to this
HOC, but you won't get much benefit unless the component is "branching", i.e.
it renders more than one non-terminal (i.e. non-HTML) component.

```typescript
const BranchingComponent = ({ a, b, c}) => (
  <A a={a}>
    <B b={b} />
    <C c={c} />
  </A>
)
```

If all your component does is mutate props or add constant props for the one
component that it renders, then it is likely faster and more memory efficient
to just let it run on every render. Plus, you might check if your component's
purpose is already served by a HOC from
[`recompose`](https://github.com/acdlite/recompose).

```typescript
const Before = (Component) => ({ x }) => <Component x={x + 1} />
import { mapProps } from 'recompose'
const After = mapProps(({ x }) => ({ x: x + 1 }))
```

However, if your component uses a subset of its props or derives props that
change less frequently than its props as a whole, then the `observer` HOC will
serve you well.

```typescript
import { computed } from 'mobx'
import { observer } from '@thejohnfreeman/observer'
class MyComponent extends React.Component {
  @computed
  private get x() {
    return this.props.x + 1
  }
  public render() {
    return <X x={this.x} />
  }
}
export default observer(MyComponent)
```
