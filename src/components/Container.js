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

class ContainerWrapper extends React.Component {
  constructor(props) {
    super(props)

    const browser = detect()
    this.state = {
      isFF: browser.name === 'firefox',
    }
  }
  componentDidMount() {
    this.reset()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      this.reset()
    }
    if (prevProps.scrollLeft !== this.props.scrollLeft) {
      ReactDOM.findDOMNode(this).scrollLeft = this.state.isFF
        ? this.props.scrollLeft - this.props.scrollWidth
        : this.props.scrollLeft
    }
  }
  reset() {
    const element = ReactDOM.findDOMNode(this)
    this.props.reset &&
      this.props.reset(
        element.scrollWidth - element.clientWidth,
        element.scrollWidth - element.clientWidth
      )
  }

  render() {
    return <Container {...this.props} />
  }
}

class ScrollableContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      limit: 1000000,
      scrollLeft: 1000000,
    }
    this.reset = this.reset.bind(this)
    this.wheel = this.wheel.bind(this)
  }
  reset(limit, scrollLeft) {
    this.setState({
      limit,
      scrollLeft,
    })
  }
  wheel(event) {
    if (event.deltaY != 0) {
      const diff =
        event.deltaMode === 0 ? event.deltaY : Math.round(event.deltaY * 33.3)
      const left = Math.min(
        Math.max(0, this.state.scrollLeft - diff),
        this.state.limit
      )
      this.setState({ scrollLeft: left })
      event.preventDefault()
    }
    return
  }

  render() {
    const siteTitle = this.props.title

    return (
      <Motion
        defaultStyle={{ scrollLeft: this.state.limit }}
        style={{ scrollLeft: spring(this.state.scrollLeft, [120, 17]) }}
      >
        {currentStyles => (
          <ContainerWrapper
            onWheel={this.wheel}
            scrollWidth={this.state.limit}
            scrollLeft={currentStyles.scrollLeft}
            path={this.props.path}
            reset={this.reset}
          >
            {this.props.children}
          </ContainerWrapper>
        )}
      </Motion>
    )
  }
}

export default ScrollableContainer
