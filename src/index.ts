import { computed, IReactionDisposer, observable, reaction } from 'mobx'
import * as React from 'react'

// TODO: Use getDisplayName, setDisplayName, and wrapDisplayName from
// `recompose`.

function constructComponent<P>(Component: React.ComponentType<P>, props: P) {
  return Component.prototype instanceof React.Component
    ? // Stateful class component.
      new (Component as React.ComponentClass<P>)(props)
    : // Stateless functional component (SFC).
      {
        Component,
        // displayName: displayName(Component),
        props,
        render() {
          return (Component as React.SFC<P>)(this.props)
        },
      }
}

export function observer<P = {}>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  class ObserverComponent extends React.Component<P> {
    // public static readonly displayName = `observer(${displayName(Component)})`

    private readonly component = constructComponent(
      Component,
      observable(this.props),
    )

    @observable
    private mounted = false

    @computed
    private get element() {
      // console.log(`rebuilding ${displayName(this.component)}`, this.component)
      return this.component.render()
    }

    private disposer: IReactionDisposer | null = reaction(
      () => [this.element, this.mounted],
      () => {
        if (this.mounted) {
          this.forceUpdate()
        }
      },
    )

    public shouldComponentUpdate(props: P) {
      // console.log('updating props', props, this.component)
      Object.assign(this.component.props, props)
      return false
    }

    public componentDidMount() {
      this.mounted = true
    }

    public componentWillUnmount() {
      this.mounted = false
      this.disposer!()
      this.disposer = null
    }

    public render() {
      return this.element
    }
  }
  return ObserverComponent
}
