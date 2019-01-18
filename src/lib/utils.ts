import { get } from 'lodash'

const TIMEOUT = 2000

export const findLocalIp = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const RTCPeerConnection = get(
      window,
      'RTCPeerConnection',
      get(window, 'mozRTCPeerConnection', get(window, 'webkitRTCPeerConnection')),
    )
    if (!RTCPeerConnection) return reject(new Error('No Webrtc'))
    const pc = new RTCPeerConnection()
    const ips = [] as Array<string>
    pc.createDataChannel('')
    pc.createOffer()
      .then((offer: any) => pc.setLocalDescription(offer))
      .catch((err: Error) => reject(err))
    pc.onicecandidate = (event: any) => {
      if (!event || !event.candidate) {
        if (ips.length == 0) return reject(new Error('No Webrtc'))
        return resolve(ips[0])
      }
      const parts = event.candidate.candidate.split(' ')
      const ip = parts[4]
      if (!ips.some(e => e == ip)) ips.push(ip)
    }
  })

export const findFriends = (
  ip: string,
  start: number,
  end: number,
  handler: (url: string) => void,
) => {
  const baseIp = ip
    .split('.')
    .slice(0, -1)
    .join('.')

  const ports = Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
  const errorsCounter = [] as string[]
  const workingCounter = [] as string[]
  const abortsCounter = [] as string[]
  for (let idx = 0; idx < 255; idx++) {
    const address = `http://${baseIp}.${idx}`
    for (let jdx = 0; jdx < ports.length; jdx++) {
      const port = ports[jdx]
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
}
