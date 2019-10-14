import * as React from 'react'
import { findLocalIp } from '../lib/utils'

const MAX_PORTS = 5

type FormProps = {
  handleSubmit: (port: number, localIp: string) => void
}

export default class Form extends React.Component<FormProps> {
  state = { port: 8000, localIp: '' }

  async componentDidMount() {
    const localIp = await findLocalIp()
    this.setState({ localIp })
  }

  handlePort = (e: React.FormEvent<HTMLInputElement>) => {
    const port = Number(e.currentTarget.value)
    this.setState({ port })
  }

  handleSubmit = () => {
    const { port, localIp } = this.state
    this.props.handleSubmit(port, localIp)
  }

  render() {
    const { port, localIp } = this.state
    return (
      <div>
        <div className="f3 tc pb3">Your local IP is: {localIp}</div>
        <div className="flex flex-column justify-center items-center">
          <div>
            <span>Scan active servers on port</span>
            <input
              type="number"
              className="mh2"
              value={port}
              min="80"
              max="20000"
              step="1"
              onChange={this.handlePort}
            />
          </div>
          <div
            onClick={this.handleSubmit}
            className="pointer pa3 ba bg-black white tc mt3 w-30 br3"
          >
            Search!
          </div>
        </div>
      </div>
    )
  }
}
