import './style.css'
import 'prismjs/themes/prism-solarizedlight.css'

import React from 'react'
import styled from 'styled-components'
import gray from 'gray-percentage'

import Link from 'gatsby-link'

import { rhythm } from '../utils/typography'

import Container from '../components/Container'
import Hashira from '../components/Hashira'

const Contents = styled.div`
  height: 100%;
  min-width: 100%;
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  padding: ${rhythm(2.8)} ${rhythm(3 / 4)} ${rhythm(2.2)} ${rhythm(3 / 4)};
`

class Template extends React.Component {
  constructor(props) {
    super(props)
    this.state = { scrollLeft: 0 }
    this.scroll = this.scroll.bind(this)
  }
  componentDidMount() {
    this.scrollable = document.querySelector('.scrollable')
  }
  scroll(event) {
    if (event.deltaY != 0) {
      this.state = this.state + event.deltaY * 3
      event.preventDefault()
    }
    return
  }

  render() {
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Container title={siteTitle} path={this.props.location.pathname}>
        <Hashira>
          <Link
            style={{
              fontSize: `0.8em`,
              color: gray(45),
            }}
            to={'/'}
          >
            {siteTitle}
          </Link>
        </Hashira>
        <Contents>{this.props.children()}</Contents>
      </Container>
    )
  }
}

export default Template

export const layoutQuery = graphql`
  query layoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
