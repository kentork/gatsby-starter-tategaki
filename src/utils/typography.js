import Typography from 'typography'
import gray from 'gray-percentage'
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants'

const theme = {
  title: 'Tategaki',
  baseFontSize: '18px',
  baseLineHeight: 1.75,
  scaleRatio: 5 / 2,
  // googleFonts: [
  //   {
  //     name: 'Open Sans',
  //     styles: ['200', '400', '400i', '700'],
  //   },
  //   {
  //     name: 'Roboto',
  //     styles: ['200', '400', '400i', '700'],
  //   },
  // ],
  headerFontFamily: [
    'Roboto Regular',
    '-apple-system',
    'BlinkMacSystemFont',
    'Helvetica Neue',
    'YuGothic',
    'Yu Gothic',
    'Meiryo',
    'sans-serif',
  ],
  bodyFontFamily: [
    'Roboto Regular',
    '-apple-system',
    'BlinkMacSystemFont',
    'Helvetica Neue',
    'YuGothic',
    'Yu Gothic',
    'Meiryo',
    'sans-serif',
  ],
  bodyColor: 'hsla(0,0%,0%,0.9)',
  headerWeight: 900,
  bodyWeight: 500,
  boldWeight: 700,
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    'img,h2,h3,h4,h5,h6,hgroup,ul,dl,ol,dd,p,figure,pre,table': {
      marginLeft: '1.75rem',
      marginBottom: 0,
    },
    'div.gatsby-highlight': {
      marginLeft: '1.75rem',
    },
    h1: {
      marginTop: '10%',
      marginBottom: '10%',
      marginLeft: '3.5rem',
      marginRight: '4.15rem',
      color: `${gray(20)}`,
    },
    h2: {
      color: `${gray(16)}`,
    },
    h4: {
      letterSpacing: '0.140625em',
      textTransform: 'uppercase',
    },
    h6: {
      fontStyle: 'italic',
    },
    blockquote: {
      ...scale(1 / 5),
      color: gray(41),
      fontStyle: 'italic',
      paddingTop: rhythm(13 / 16),
      marginTop: rhythm(-1),
      borderTop: `${rhythm(3 / 16)} solid ${gray(10)}`,
    },
    hr: {
      marginLeft: `calc(1.75rem - 1px)`,
      marginBottom: 0,
      height: `100%`,
      width: `1px`,
    },
    p: {
      textIndent: `1em`,
    },
    ul: {
      marginTop: `1.75rem`,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: `1.75rem`,
    },
    li: {
      marginRight: `calc(1.75rem / 2)`,
    },
    'li *:last-child': {
      marginBottom: 0,
      marginLeft: 0,
    },
    'li > p': {
      marginLeft: `calc(1.75rem / 2)`,
      textIndent: 0,
    },
    a: {
      boxShadow: '-1px 0 0 0 currentColor',
      transition: `all 0.2s ease-out`,
      color: '#007acc',
      textDecoration: 'none',
    },
    'a:hover,a:active': {
      boxShadow: 'none',
    },
    'a.gatsby-resp-image-link': {
      boxShadow: 'none',
    },
    'span.morpheme': {
      display: `inline-block`,
      whiteSpace: `pre-wrap`,
      textIndent: 0,
    },
    'th:first-child, td:first-child': {
      paddingLeft: `1.16667rem`,
      textAlign: `right`,
    },
    'th:last-child, td:last-child': {
      paddingRight: `0.875rem`,
    },
    'th, td': {
      borderLeft: `1px solid hsla(0,0%,0%,0.12)`,
      borderBottom: `none`,
      paddingTop: `1.16667rem`,
      paddingBottom: `1.16667rem`,
      paddingRight: `0.875rem`,
      paddingLeft: `calc(0.875rem - 1px)`,
    },
    // 'mark,ins': {
    //   background: '#007acc',
    //   color: 'white',
    //   padding: `${rhythm(1 / 8)} ${rhythm(1 / 16)}`,
    //   textDecoration: 'none',
    // },
  }),
}

const typography = new Typography(theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
