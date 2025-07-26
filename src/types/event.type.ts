type Event = {
  name: string
  once: boolean
  execute: (...args: any) => Promise<void>
}

export default Event
