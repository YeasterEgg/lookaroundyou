import * as React from 'react'

type ScreenProps = {
  addresses: string[]
}

const bigIframeStyle = {
  WebkitTransform: 'scale(0.9)',
  MozTransform: 'scale(0.9)',
  transform: 'scale(0.9)',
}

const Screen = (props: {
  address: string
  idx: number
  baseWidth: number
  baseHeight: number
  setBig: (idx: number) => void
}) => {
  const { address, idx, baseHeight, baseWidth } = props
  const style = {
    top: -window.innerHeight / 4 + (0.5 + Math.floor(idx / 2)) * baseHeight,
    left: -window.innerWidth / 2 + baseWidth / 2 + (idx % 2) * baseWidth,
  }
  const iframeTranslate = -0.5 * baseHeight
  const smallIframeStyle = {
    WebkitTransform: `translateY(${iframeTranslate}px) scale(0.4)`,
    MozTransform: `translateY(${iframeTranslate}px) scale(0.4)`,
    transform: `translateY(${iframeTranslate}px) scale(0.4)`,
  }
  return (
    <div className="pointer absolute flex flex-column" style={style} key={address}>
      <a className="w-100 tc f5 pb2 no-underline absolute" href={address} target="_blank">
        {address}
      </a>
      <iframe
        src={address}
        width={window.innerWidth}
        height={window.innerHeight}
        style={smallIframeStyle}
      />
    </div>
  )
}

export default class Display extends React.Component<ScreenProps> {
  state = { bigIndex: 0 }

  nextBig = () => {
    const { addresses } = this.props
    const { bigIndex } = this.state
    const nextIndex = bigIndex === addresses.length - 1 ? 0 : bigIndex + 1
    this.setState({ bigIndex: nextIndex })
  }

  previousBig = () => {
    const { addresses } = this.props
    const { bigIndex } = this.state
    const nextIndex = bigIndex === 0 ? addresses.length - 1 : bigIndex - 1
    this.setState({ bigIndex: nextIndex })
  }

  setBig = (bigIndex: number) => {
    this.setState({ bigIndex })
  }

  render() {
    const baseHeight = window.innerHeight / 2
    const baseWidth = window.innerWidth / 2
    const { addresses } = this.props
    const { bigIndex } = this.state
    return (
      <div className="w-100 h-100 flex flex-column">
        <div className="h-100 w-100 relative flex">
          <div className="absolute flex flex-column w-100 h-100 justify-center items-center">
            <div className="flex justify-around items-center w-80">
              <div onClick={this.previousBig} className="pointer">
                PREVIOUS
              </div>
              <a className="w-100 tc f4 pb1 no-underline" href={addresses[0]} target="_blank">
                {addresses[bigIndex]}
              </a>
              <div onClick={this.nextBig} className="pointer">
                NEXT
              </div>
            </div>
            <iframe
              style={bigIframeStyle}
              src={addresses[bigIndex]}
              key={addresses[bigIndex]}
              width={window.innerWidth / 1.5}
              height={window.innerHeight}
            />
          </div>
        </div>
        <div className="h-50 w-50 relative">
          {addresses.map((address, idx) => (
            <Screen
              idx={idx}
              address={address}
              key={address}
              baseHeight={baseHeight}
              baseWidth={baseWidth}
              setBig={this.setBig}
            />
          ))}
        </div>
      </div>
    )
  }
}
