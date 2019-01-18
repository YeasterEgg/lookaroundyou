import * as React from 'react'
import { findLocalIp } from '../lib/utils'
import { clamp } from 'lodash'

const MAX_PORTS = 5

type FormProps = {
  handleSubmit: (start: number, end: number, localIp: string) => void
}

export default class Form extends React.Component<FormProps> {
  state = { startPort: 8000, endPort: 8000, localIp: '' }

  async componentDidMount() {
    const localIp = await findLocalIp()
    this.setState({ localIp })
  }

  handleStartPort = (e: React.FormEvent<HTMLInputElement>) => {
    const { endPort } = this.state
    const userValue = Number(e.currentTarget.value)
    const startPort = clamp(userValue, endPort - MAX_PORTS, endPort)
    this.setState({ startPort })
  }

  handleEndPort = (e: React.FormEvent<HTMLInputElement>) => {
    const { startPort } = this.state
    const userValue = Number(e.currentTarget.value)
    const endPort = clamp(userValue, startPort, startPort + MAX_PORTS)
    this.setState({ endPort })
  }

  handleSubmit = () => {
    const { startPort, endPort, localIp } = this.state
    this.props.handleSubmit(startPort, endPort, localIp)
  }

  render() {
    const { startPort, endPort, localIp } = this.state
    return (
      <div>
        <div className="f3 tc pb3">Your local IP is: {localIp}</div>
        <div className="flex flex-column justify-center items-center">
          <div>
            <span>Scan active servers between port</span>
            <input
              type="number"
              className="mh2"
              value={startPort}
              min="80"
              max="20000"
              step="1"
              onChange={this.handleStartPort}
            />
            <span>and port</span>
            <input
              type="number"
              className="mh2"
              value={endPort}
              min="80"
              max="20000"
              step="1"
              onChange={this.handleEndPort}
            />{' '}
          </div>
          <div>You can scan no more than {MAX_PORTS} ports</div>
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
