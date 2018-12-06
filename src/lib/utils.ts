import { get } from 'lodash'

// const STATUS = {
//   NOTHING: 0,
//   SOMETHING: 1,
//   ACCESSIBLE: 2,
// }
// const TIMEOUT = 20

// const timeoutPromiseFactory = (val: any): Promise<any> => {
//   return new Promise(resolve => setTimeout(() => resolve(val), TIMEOUT))
// }

// const pinger = () => {
//   const image = new Image()
//   const testUrl = (url: string) => {
//     const imagePromise = new Promise(resolve => {
//       image.onload = () => resolve(STATUS.ACCESSIBLE)
//       image.onerror = () => resolve(STATUS.SOMETHING)
//       image.src = url
//     })
//     const timeoutPromise = timeoutPromiseFactory(STATUS.NOTHING)
//     return Promise.race([imagePromise, timeoutPromise])
//   }
//   return testUrl
// }

const findLocalIp = (): Promise<Array<string>> =>
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
        return resolve(ips)
      }
      const parts = event.candidate.candidate.split(' ')
      const ip = parts[4]
      if (!ips.some(e => e == ip)) ips.push(ip)
    }
  })

// const checkNeighborhood = async () => {
//   const localIp = (await findLocalIp())[0]
//   const baseIp = localIp
//     .split('.')
//     .slice(0, -1)
//     .join('.')
// }

export const findFriends = async (handler: (url: string) => void) => {
  const ips = await findLocalIp()
  const baseIp = ips[0]
    .split('.')
    .slice(0, -1)
    .join('.')
  const addresses = Array.from({ length: 256 }, (_, idx) => `http://${baseIp}.${idx}:8000`)
  addresses.forEach(async address => {
    try {
      await window.fetch(address, { mode: 'no-cors' })
      handler(address)
    } catch (e) {
      console.log(e)
    }
  })
}
