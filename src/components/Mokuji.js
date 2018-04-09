import React from 'react'
import styled from 'styled-components'

import Link from 'gatsby-link'

import Hizuke from '../components/Hizuke'

const Body = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  color: #000;
`
const Title = styled.span`
  line-height: 1.3rem;
  box-sizing: border-box;
`
const Line = styled.div`
  flex: 1 0 auto;
  width: 0;
  margin-top: 0.4rem;
  margin-bottom: 0.2rem;
  border-left: 1px dotted #000;
  min-height: 30px;
`

export const Koumoku = ({ title, date }) => (
  <Body>
    <Title>{title}</Title>
    <Line />
    <Hizuke
      style={{
        marginLeft: 0,
        flex: `0 0 182px`,
        textAlign: `right`,
      }}
      date={new Date(date)}
    />
  </Body>
)

const Excerpt = styled.div`
  color: #000;
  margin-top: 6rem;
  margin-right: 0.6rem;
  font-size: 0.9rem;
`

export const Bassui = ({ text }) => (
  <Excerpt dangerouslySetInnerHTML={{ __html: text }} />
)

const Label = styled.p`
  font-size: 1.3em;
  text-align: center;
  letter-spacing: 6rem;
  margin-left: 1.8rem;
  font-weight: 600;
`
const Item = styled.li`
  transition: all 0.2s ease-out;
  border: 1px dashed transparent;
  margin-right: 1.8rem;
  &:hover {
    border: 1px dashed #2ca9e1;
  }
`
const Navigation = styled(Link)`
  margin-left: 1rem;
  box-shadow: none;
  display: block;
`

export const Mokuji = ({ style, posts }) => {
  return (
    <div style={style}>
      <ul style={{ listStyle: `none` }}>
        <Label>目次</Label>
        {posts.map(post => (
          <Item>
            <Navigation to={post.node.fields.slug}>
              <Koumoku
                title={post.node.frontmatter.title}
                date={post.node.frontmatter.date}
              />
              <Bassui text={post.node.excert} />
            </Navigation>
          </Item>
        ))}
      </ul>
    </div>
  )
}
