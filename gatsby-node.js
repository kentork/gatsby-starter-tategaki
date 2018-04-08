const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  html
                  fields {
                    slug
                  }
                  frontmatter {
                    date(formatString: "DD MMMM, YYYY")
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges

        // create excerpt
        posts.forEach(post => {
          post.node.excert =
            post.node.html
              .slice(0, post.node.html.indexOf('<wbr/>', 600))
              .replace(/<wbr\/>/g, '__WBR__')
              .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
              .replace(/__WBR__/g, '<wbr/>') + '...'
        })

        // Create index pages.
        const limit = 5
        let groups = []
        for (var i = 0; i < posts.length; i += limit) {
          groups.push(posts.slice(i, i + limit))
        }
        const minPage = 1
        const maxPage = groups.length
        groups.forEach((group, index) => {
          const current = index + 1
          const prev = current + 1
          const next = current - 1

          createPage({
            path: `/${current === 1 ? '' : current}`,
            component: path.resolve('./src/templates/index.js'),
            context: {
              group,
              page: current,
              prevPath: prev <= maxPage ? `/${prev === 1 ? '' : prev}` : null,
              nextPath: next >= minPage ? `/${next === 1 ? '' : next}` : null,
            },
          })
        })

        // Create blog posts pages.
        posts.forEach((post, index) => {
          const previous =
            index === posts.length - 1 ? false : posts[index + 1].node
          const next = index === 0 ? false : posts[index - 1].node

          createPage({
            path: post.node.fields.slug,
            component: path.resolve('./src/templates/post.js'),
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
