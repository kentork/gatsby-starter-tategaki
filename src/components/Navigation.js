import React from 'react'
import styled from 'styled-components'

import Link from 'gatsby-link'

import { rhythm } from '../utils/typography'

const NavigationBar = styled.nav`
  font-size: 1.1em;
  display: flex;
  position: absolute;
  left: 0;
`
const Space = styled.div`
  height: 100px;
`
const Tumekake = styled(Link)`
  display: block;
  height: 100px;
  width: 55px;
  background: #191616;
  color: rgba(251, 251, 251, 0.9294117647058824);
  padding: 1rem;
  margin-top: 2rem;

  &:hover {
    background: #a23535;
  }
`

export default ({ style, next, previous }) => {
  return (
    <NavigationBar style={style}>
      {previous ? (
        <Tumekake
          style={{ padding: `0.4rem 0.4rem 0rem 0rem` }}
          to={previous.fields.slug}
          rel="prev"
        >
          ↑ 前
        </Tumekake>
      ) : (
        <Space />
      )}
      {next && (
        <Tumekake
          style={{ padding: `2.2rem 0.4rem 0rem 0rem` }}
          to={next.fields.slug}
          rel="next"
        >
          次 ↓
        </Tumekake>
      )}
    </NavigationBar>
  )
}
