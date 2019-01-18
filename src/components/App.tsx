import * as React from 'react'
import Form from './Form'
import Display from './Display'
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
    return (
      <div className="w-100 h-100 flex flex-column justify-center relative">
        <div className="f2 top-1 w-100 tc h-10 flex items-center justify-center">
          Look Around You
        </div>
        <div className="w-100 flex justify-center items-center h-90">
          {loading ? (
            <Display addresses={workingIps} />
          ) : (
            <Form handleSubmit={this.startSearching} />
          )}
        </div>
      </div>
    )
  }
}
