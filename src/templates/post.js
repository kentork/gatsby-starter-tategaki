import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import { rhythm } from '../utils/typography'

import Hizuke from '../components/Hizuke'
import { Komejirushi } from '../components/Kugiri'
import Navigation from '../components/Navigation'
import Recommend from '../components/Recommend'

const Title = styled.h1`
  margin-top: ${rhythm(1.0)};
  margin-bottom: ${rhythm(1.2)};
`

const Footer = styled

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pathContext

    const recommends = this.props.data.allMarkdownRemark.edges
      .filter(e => e.id !== post.id)
      .sort((a, b) => 0.5 - Math.random())
      .slice(0, 3)

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <Title>{post.frontmatter.title}</Title>
        <Hizuke
          style={{
            textAlign: 'right',
          }}
          date={new Date(post.frontmatter.date)}
        />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Komejirushi style={{ marginRight: `10rem` }} />
        <Recommend style={{ marginLeft: `9rem` }} posts={recommends} />
        <Navigation previous={previous} next={next} />
      </div>
    )
  }
}
export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date
      }
    }
    allMarkdownRemark {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`
