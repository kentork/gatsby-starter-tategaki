import React from 'react'
import styled from 'styled-components'

export const Sen = styled.div`
  height: 100%;
  width: 1px;
  background-color: #f5f3f7;
  padding: 0;
  margin: 0 3.5rem 0 0.8rem;
  border: none;
`

const Mannaka = styled.p`
  height: 100%;
  font-size: 32px;
  color: #000;
  text-align: center;
`

export const Komejirushi = ({ style }) => <Mannaka style={style}>{'*'}</Mannaka>
