const TIMEOUT = 2000

export const findLocalIp = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const RTCPeerConnection =
      window['RTCPeerConnection'] ||
      window['mozRTCPeerConnection'] ||
      window['webkitRTCPeerConnection']
    if (!RTCPeerConnection) return reject(new Error('No Webrtc'))
    const pc = new RTCPeerConnection({ iceServers: [] })
    const ips = [] as Array<string>
    pc.createDataChannel('')
    pc.createOffer()
      .then((offer: any) => {
        return pc.setLocalDescription(offer)
      })
      .catch((err: Error) => reject(err))
    pc.onicecandidate = (event: any) => {
      if (!event || !event.candidate || !event.candidate.candidate) {
        if (ips.length === 0) return reject(new Error('No Webrtc'))
        return resolve(ips[0])
      }
      const parts = event.candidate.candidate.split(' ')
      const ip = parts[4]
      if (!ips.includes(ip)) ips.push(ip)
    }
  })

export const findFriends = (ip: string, port: number, handler: (url: string) => void) => {
  const baseIp = ip
    .split('.')
    .slice(0, -1)
    .join('.')

  const errorsCounter = [] as string[]
  const workingCounter = [] as string[]
  const abortsCounter = [] as string[]
  for (let idx = 0; idx < 255; idx++) {
    const address = `http://${baseIp}.${idx}`
    const completeAddress = `${address}:${port}`
    const controller = new AbortController()
    const signal = controller.signal
    setTimeout(() => controller.abort(), TIMEOUT)
    window
      .fetch(completeAddress, { mode: 'no-cors', signal })
      .then(res => {
        handler(completeAddress)
        workingCounter.push(completeAddress)
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          abortsCounter.push(completeAddress)
        } else {
          errorsCounter.push(completeAddress)
        }
      })
  }
}
