import React from 'react'
import styled from 'styled-components'

import Link from 'gatsby-link'

import { Koumoku } from '../components/Mokuji'

const Label = styled.p`
  font-size: 1.3em;
  text-align: center;
  letter-spacing: 2rem;
  margin-left: 1.6rem;
  font-weight: 600;
`
const Item = styled.li`
  transition: all 0.2s ease-out;
  border: 1px dashed transparent;
  margin-right: 0.2rem;
  &:hover {
    border: 1px dashed #2ca9e1;
  }
`
const Navigation = styled(Link)`
  margin-left: 1rem;
  box-shadow: none;
  display: block;
`

export default ({ style, posts }) => {
  return (
    <div style={style}>
      <ul style={{ listStyle: `none` }}>
        <Label>関連記事</Label>
        {posts.map(post => (
          <Item>
            <Navigation to={post.node.fields.slug}>
              <Koumoku
                title={post.node.frontmatter.title}
                date={post.node.frontmatter.date}
              />
            </Navigation>
          </Item>
        ))}
      </ul>
    </div>
  )
}
