import { mount, ReactWrapper } from 'enzyme'

// A class for tracking mounts in order to automatically unmount after every
// test (regardless of whether it succeeded).
export class Enzyme {
  private wrappers: ReactWrapper[] = []

  public mount(element: JSX.Element): ReactWrapper {
    const wrapper = mount(element)
    this.wrappers.push(wrapper)
    return wrapper
  }

  public unmount(wrapper: ReactWrapper) {
    const index = this.wrappers.indexOf(wrapper)
    if (index < 0) {
      // TODO: Use a serializer good for debugging.
      throw new Error('component not mounted in this scope: ' + wrapper)
    }
    this.wrappers.splice(index, 1)
    wrapper.unmount()
  }

  public unmountAll() {
    this.wrappers.forEach(wrapper => wrapper.unmount())
    this.wrappers = []
  }
}

const enzyme = new Enzyme()

export default enzyme
