import * as React from 'react'
import { findLocalIp } from '../lib/utils'

interface FormProps {
  handleSubmit: (port: number, localIp: string) => void
}

interface ErrorProps {
  onSubmit: (text: string) => void
}

function Error(props: ErrorProps) {
  const [textInput, setInput] = React.useState('')
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSubmit = () => props.onSubmit(textInput)

  return (
    <div className="absolute absolute--fill o-60 bg-white flex items-center justify-center">
      <div className="w-60 tc">
        <div className="f2">Your browser does not support local IP scan.</div>
        <div className="pv3 f3">
          Either insert it here:
          <form onSubmit={onSubmit}>
            <input type="text" onInput={onInput} />
          </form>
        </div>
        <div className="f3">
          or change the flag `enable-webrtc-hide-local-ips-with-mdns` and reload.
        </div>
      </div>
    </div>
  )
}

export default class Form extends React.Component<FormProps> {
  state = { port: 8000, localIp: '', error: false }

  async componentDidMount() {
    findLocalIp()
      .then(localIp => this.setState({ localIp }))
      .catch(err => this.setState({ error: true }))
  }

  handlePort = (e: React.FormEvent<HTMLInputElement>) => {
    const port = Number(e.currentTarget.value)
    this.setState({ port })
  }

  handleSubmit = () => {
    const { port, localIp } = this.state
    this.props.handleSubmit(port, localIp)
  }

  handleManualInsert = (localIp: string) => {
    this.setState({ localIp, error: true })
  }

  render() {
    const { port, localIp, error } = this.state
    if (error) return <Error onSubmit={this.handleManualInsert} />
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
