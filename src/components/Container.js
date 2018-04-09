import React from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import styled from 'styled-components'
import { detect } from 'detect-browser'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow-x: scroll;
  overflow-y: hidden;
  will-change: scroll-position;
`

const IS_FF = detect().name === 'firefox'

class ContainerWrapper extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.scrollLeft !== this.props.scrollLeft) {
      ReactDOM.findDOMNode(this).scrollLeft = IS_FF
        ? this.props.scrollLeft - this.props.scrollWidth
        : this.props.scrollLeft
    }
  }

  render() {
    return (
      <Container innerRef={el => this.props.innerRef(el)} {...this.props} />
    )
  }
}

class ScrollableContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      limit: 1000000,
      scrollLeft: 1000000,
      useAnimation: false,
    }
    this.resize = this.resize.bind(this)
    this.remeasurement = this.remeasurement.bind(this)
    this.wheel = this.wheel.bind(this)
    this.scroll = this.scroll.bind(this)

    this.resizeFunc = debounce(this.resize, 500)
    this.scrollFunc = debounce(this.scroll, 200)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeFunc)
    window.addEventListener('orientationchange', this.resizeFunc)
    this.remeasurement()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunc)
    window.removeEventListener('orientationchange', this.resizeFunc)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      this.remeasurement()
    }
  }
  remeasurement() {
    this.setState({
      limit: this.container.scrollWidth - this.container.offsetWidth,
      scrollLeft: this.container.scrollWidth - this.container.offsetWidth,
      useAnimation: false,
    })
  }
  resize() {
    this.remeasurement()
  }

  wheel(event) {
    if (event.deltaY != 0) {
      const diff =
        event.deltaMode === 0 ? event.deltaY : Math.round(event.deltaY * 33.3)
      const left = Math.min(
        Math.max(0, this.state.scrollLeft - diff),
        this.state.limit
      )
      this.setState({
        scrollLeft: left,
        useAnimation: true,
      })
      event.preventDefault()
    }
    return
  }
  scroll(event) {
    this.setState({
      scrollLeft: IS_FF
        ? this.container.scrollLeft + this.state.limit
        : this.container.scrollLeft,
      useAnimation: false,
    })
  }

  render() {
    const siteTitle = this.props.title

    return (
      <Motion
        defaultStyle={{ scrollLeft: this.state.limit }}
        style={{
          scrollLeft: this.state.useAnimation
            ? spring(this.state.scrollLeft, [120, 17])
            : this.state.scrollLeft,
        }}
      >
        {currentStyles => (
          <ContainerWrapper
            onWheel={this.wheel}
            onScroll={this.scrollFunc}
            scrollWidth={this.state.limit}
            scrollLeft={currentStyles.scrollLeft}
            path={this.props.path}
            reset={this.reset}
            innerRef={el => (this.container = el)}
          >
            {this.props.children}
          </ContainerWrapper>
        )}
      </Motion>
    )
  }
}

export default ScrollableContainer

function debounce(callback, interval) {
  let timer
  return function debounced() {
    clearTimeout(timer)

    const args = arguments
    const that = this
    timer = setTimeout(() => {
      callback.apply(that, args)
    }, interval)
  }
}
