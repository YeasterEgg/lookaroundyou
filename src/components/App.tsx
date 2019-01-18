import * as React from 'react'
import Form from './Form'
import Loading from './Loading'
import { findFriends } from '../lib/utils'

export default class App extends React.Component {
  state = {
    loading: false,
    start: 8000,
    end: 8000,
    localIp: '',
    workingIps: [] as string[],
  }

  startSearching = (start: number, end: number, localIp: string) => {
    this.setState({ loading: true, start, end, localIp }, this.startScanning)
  }

  startScanning = () => {
    const { localIp, start, end } = this.state
    findFriends(localIp, start, end, this.workingIpHandler)
  }

  workingIpHandler = (ip: string) => {
    this.setState({ workingIps: [...this.state.workingIps, ip] })
  }

  render() {
    const { loading, workingIps } = this.state
    const Body = loading ? (
      <div>
        {workingIps.map(c => (
          <div>{c}</div>
        ))}
      </div>
    ) : (
      <Form handleSubmit={this.startSearching} />
    )
    return (
      <div className="w-100 h-100 flex items-center justify-center relative">
        <div className="absolute f2 top-1 w-100 tc">Look Around You</div>
        <div className="w-100 flex justify-center">{Body}</div>
      </div>
    )
  }
}
