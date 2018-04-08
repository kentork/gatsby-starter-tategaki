import React from 'react'
import styled from 'styled-components'

import { options } from '../utils/typography'

const { bodyFontFamily } = options

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  margin-top: 24px;
  margin-left: 22px;
  writing-mode: horizontal-tb;
  font-family: ${bodyFontFamily.join(' ')};

  & a {
    box-shadow: 0 1px 0 0 currentColor;
  }
  & a:hover,
  a:active {
    box-shadow: none;
  }
`

export default ({ style, children }) => (
  <FixedHeader style={style}>{children}</FixedHeader>
)
