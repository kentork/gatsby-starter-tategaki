import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Link from 'gatsby-link'

import { Mokuji } from '../components/Mokuji'

const Pagenation = styled.div`
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  writing-mode: horizontal-tb;
`
const Navigation = styled(Link)`
  display: inline-block;
  width: 20px;
  font-family: sans-serif;
  text-align: center;
`
const Space = styled.div`
  display: inline-block;
  width: 20px;
`
const Number = styled.span`
  display: inline-block;
  width: 32px;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
`

class BlogIndexTemplate extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title
    const { pathContext: { group, page, nextPath, prevPath } } = this.props

    return (
      <div>
        <Helmet title={siteTitle} />
        <Mokuji
          style={{ marginLeft: `2rem`, marginRight: `4rem` }}
          posts={group}
        />
        <Pagenation>
          {prevPath ? (
            <Navigation style={{ boxShadow: 'none' }} to={prevPath}>
              ←
            </Navigation>
          ) : (
            <Space />
          )}
          <Number>{page}</Number>
          {nextPath ? (
            <Navigation style={{ boxShadow: 'none' }} to={nextPath}>
              →
            </Navigation>
          ) : (
            <Space />
          )}
        </Pagenation>
      </div>
    )
  }
}
export default BlogIndexTemplate

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
