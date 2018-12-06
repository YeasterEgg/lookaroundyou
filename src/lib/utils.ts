import { get } from 'lodash'
import pMap from 'p-map'

const STATUS = {
  TIMEOUT: 0,
  ERROR: 1,
  LOADED: 2,
}
const TIMEOUT = 1000

const timeoutPromiseFactory = (val: any, img: HTMLImageElement): Promise<any> => {
  return new Promise(resolve =>
    setTimeout(() => {
      img.src = ''
      img = null
      resolve(val)
    }, TIMEOUT),
  )
}

const ping = (url: string): Promise<number> => {
  let image = new Image()
  const imagePromise = new Promise(resolve => {
    image.onload = () => resolve(STATUS.LOADED)
    image.onerror = () => resolve(STATUS.ERROR)
    image.src = url
  })
  const timeoutPromise = timeoutPromiseFactory(STATUS.TIMEOUT, image)
  return Promise.race([imagePromise, timeoutPromise])
}

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
  // const iterator = async (address: string) => {
  //   try {
  //     const status = await ping(address)
  //     return status ? address : 0
  //   } catch {
  //     return 0
  //   }
  // }
  // const results = (await pMap(addresses, iterator)) as (0 | string)[]
  // const validAddresses = results.filter(r => r !== 0)
  // console.log('validAddresses', validAddresses)
  addresses.forEach(async (address: string) => {
    try {
      await window.fetch(address, { mode: 'no-cors' })
      handler(address)
    } catch (e) {
      console.log(e)
    }
  })
}
