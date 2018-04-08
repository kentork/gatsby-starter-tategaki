import React from 'react'
import styled from 'styled-components'

import { rhythm } from '../utils/typography'

const HorizontalNumber = styled.span`
  text-combine-upright: all;
  margin: 0.2em 0;
  font-size: 1.2em;
  font-family: '游ゴシック Medium', 'Yu Gothic', 'YuGothic', 'Verdana', 'Meiryo',
    sans-serif;
`
const HorizontalYear = HorizontalNumber.extend`
  font-size: 1.3em;
`
const Youbi = styled.span`
  writing-mode: horizontal-tb;
`

export default ({ style, date }) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const youbi = '日月火水木金土'[date.getDay()]

  return (
    <p style={Object.assign({ textIndent: 0 }, style)}>
      <HorizontalYear>{year}</HorizontalYear>年
      <HorizontalNumber>{month}</HorizontalNumber>月
      <HorizontalNumber>{day}</HorizontalNumber>日
      <Youbi>{`(${youbi})`}</Youbi>
    </p>
  )
}
