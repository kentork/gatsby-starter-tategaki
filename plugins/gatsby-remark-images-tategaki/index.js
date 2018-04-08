const select = require(`unist-util-select`)
const path = require(`path`)
const isRelativeUrl = require(`is-relative-url`)
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const cheerio = require(`cheerio`)
const slash = require(`slash`)

// If the image is relative (not hosted elsewhere)
// 1. Find the image file
// 2. Find the image's size
// 3. Filter out any responsive image sizes that are greater than the image's width
// 4. Create the responsive images.
// 5. Set the html w/ aspect ratio helper.
module.exports = (
  { files, markdownNode, markdownAST, pathPrefix, getNode, reporter },
  pluginOptions
) => {
  const defaults = {
    maxHeight: 650,
    maxWidth: 650,
    wrapperStyle: ``,
    backgroundColor: `white`,
    linkImagesToOriginal: true,
    showCaptions: false,
    pathPrefix,
  }

  const options = _.defaults(pluginOptions, defaults)

  // This will only work for markdown syntax image tags
  const markdownImageNodes = select(markdownAST, `image`)

  // This will also allow the use of html image tags
  const rawHtmlNodes = select(markdownAST, `html`)

  // Takes a node and generates the needed images and then returns
  // the needed HTML replacement for the image
  const generateImagesAndUpdateNode = async function(node, resolve) {
    // Check if this markdownNode has a File parent. This plugin
    // won't work if the image isn't hosted locally.
    const parentNode = getNode(markdownNode.parent)
    let imagePath
    if (parentNode && parentNode.dir) {
      imagePath = slash(path.join(parentNode.dir, node.url))
    } else {
      return null
    }

    const imageNode = _.find(files, file => {
      if (file && file.absolutePath) {
        return file.absolutePath === imagePath
      }
      return null
    })

    if (!imageNode || !imageNode.absolutePath) {
      return resolve()
    }

    let responsiveSizesResult = await sizes({
      file: imageNode,
      args: options,
      reporter,
    })

    if (!responsiveSizesResult) {
      return resolve()
    }

    // Calculate the paddingBottom %
    const ratio = `${1 / responsiveSizesResult.aspectRatio * 100}%`

    const originalImg = responsiveSizesResult.originalImg
    const fallbackSrc = responsiveSizesResult.src
    const srcSet = responsiveSizesResult.srcSet
    const presentationWidth = responsiveSizesResult.presentationWidth
    const presentationHeight = responsiveSizesResult.presentationHeight

    // Generate default alt tag
    const srcSplit = node.url.split(`/`)
    const fileName = srcSplit[srcSplit.length - 1]
    const fileNameNoExt = fileName.replace(/\.[^/.]+$/, ``)
    const defaultAlt = fileNameNoExt.replace(/[^A-Z0-9]/gi, ` `)

    // TODO
    // Fade in images on load.
    // https://www.perpetual-beta.org/weblog/silky-smooth-image-loading.html

    // Construct new image node w/ aspect ratio placeholder
    let rawHTML = `
  <span
    class="gatsby-resp-image-wrapper"
    style="position: relative; display: block; ${
      options.wrapperStyle
    }; max-width: ${presentationWidth}px; margin-top: auto; margin-bottom: auto;"
  >
    <span
      class="gatsby-resp-image-background-image"
      style="width: 90vw; height: calc(90vw * 0.8); max-width: ${presentationWidth}px; max-height: ${presentationHeight}px; background-image: url('${
      responsiveSizesResult.base64
    }'); background-size: cover; display: block;"
    >
      <img
        class="gatsby-resp-image-image"
        style="width: 90vw; height: calc(90vw * 0.8); max-width: ${presentationWidth}px; max-height: ${presentationHeight}px; margin: 0; vertical-align: middle; position: absolute; right: 0; top: 0; box-shadow: inset 0px 0px 0px 400px ${
      options.backgroundColor
    };"
        alt="${node.alt ? node.alt : defaultAlt}"
        title="${node.title ? node.title : ``}"
        src="${fallbackSrc}"
        srcset="${srcSet}"
        sizes="${responsiveSizesResult.sizes}"
      />
    </span>
  </span>
  `

    // Make linking to original image optional.
    if (options.linkImagesToOriginal) {
      rawHTML = `
  <a
    class="gatsby-resp-image-link"
    href="${originalImg}"
    style="display: block"
    target="_blank"
    rel="noopener"
  >
  ${rawHTML}
  </a>
    `
    }

    // Wrap in figure and use title as caption

    if (options.showCaptions && node.title) {
      rawHTML = `
  <figure class="gatsby-resp-image-figure">
  ${rawHTML}
  <figcaption class="gatsby-resp-image-figcaption">${node.title}</figcaption>
  </figure>
      `
    }

    return rawHTML
  }

  return Promise.all(
    // Simple because there is no nesting in markdown
    markdownImageNodes.map(
      node =>
        new Promise(async (resolve, reject) => {
          const fileType = node.url.slice(-3)

          // Ignore gifs as we can't process them,
          // svgs as they are already responsive by definition
          if (
            isRelativeUrl(node.url) &&
            fileType !== `gif` &&
            fileType !== `svg`
          ) {
            const rawHTML = await generateImagesAndUpdateNode(node, resolve)

            if (rawHTML) {
              // Replace the image node with an inline HTML node.
              node.type = `html`
              node.value = rawHTML
            }
            return resolve(node)
          } else {
            // Image isn't relative so there's nothing for us to do.
            return resolve()
          }
        })
    )
  ).then(markdownImageNodes =>
    // HTML image node stuff
    Promise.all(
      // Complex because HTML nodes can contain multiple images
      rawHtmlNodes.map(
        node =>
          new Promise(async (resolve, reject) => {
            if (!node.value) {
              return resolve()
            }

            const $ = cheerio.load(node.value)
            if ($(`img`).length === 0) {
              // No img tags
              return resolve()
            }

            let imageRefs = []
            $(`img`).each(function() {
              imageRefs.push($(this))
            })

            for (let thisImg of imageRefs) {
              // Get the details we need.
              let formattedImgTag = {}
              formattedImgTag.url = thisImg.attr(`src`)
              formattedImgTag.title = thisImg.attr(`title`)
              formattedImgTag.alt = thisImg.attr(`alt`)

              if (!formattedImgTag.url) {
                return resolve()
              }

              const fileType = formattedImgTag.url.slice(-3)

              // Ignore gifs as we can't process them,
              // svgs as they are already responsive by definition
              if (
                isRelativeUrl(formattedImgTag.url) &&
                fileType !== `gif` &&
                fileType !== `svg`
              ) {
                const rawHTML = await generateImagesAndUpdateNode(
                  formattedImgTag,
                  resolve
                )

                if (rawHTML) {
                  // Replace the image string
                  thisImg.replaceWith(rawHTML)
                } else {
                  return resolve()
                }
              }
            }

            // Replace the image node with an inline HTML node.
            node.type = `html`
            node.value = $(`body`).html() // fix for cheerio v1

            return resolve(node)
          })
      )
    ).then(htmlImageNodes =>
      markdownImageNodes.concat(htmlImageNodes).filter(node => !!node)
    )
  )
}

// from gatsby-plugin-sharp
// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-sharp
const sharp = require(`sharp`)
const { queueImageResizing, base64 } = require(`gatsby-plugin-sharp`)

async function sizes({ file, args = {}, reporter }) {
  const defaultArgs = {
    maxWidth: 800,
    maxHight: 800,
    quality: 50,
    jpegProgressive: true,
    pngCompressionLevel: 9,
    grayscale: false,
    duotone: false,
    pathPrefix: ``,
    toFormat: ``,
    sizeByPixelDensity: false,
  }
  const options = _.defaults({}, args, defaultArgs)
  options.maxWidth = parseInt(options.maxWidth, 10)
  options.maxHight = parseInt(options.maxHight, 10)

  // Account for images with a high pixel density. We assume that these types of
  // images are intended to be displayed at their native resolution.
  let metadata
  try {
    metadata = await sharp(file.absolutePath).metadata()
  } catch (err) {
    reportError(`Failed to process image ${file.absolutePath}`, err, reporter)
    return null
  }

  const { width, height, density } = metadata

  const pixelRatio =
    options.sizeByPixelDensity && typeof density === `number` && density > 0
      ? density / 72
      : 1

  let presentationWidth = 0
  let presentationHeight = 0

  const imageRatio = height / width
  const maxRatio = options.maxHight / options.maxWidth

  if (maxRatio > imageRatio) {
    presentationWidth = Math.min(
      options.maxWidth,
      Math.round(width / pixelRatio)
    )
    presentationHeight = Math.round(presentationWidth * imageRatio)
    options.maxHight = Math.round(options.maxWidth * imageRatio)
  } else {
    presentationHeight = Math.min(
      options.maxHight,
      Math.round(height / pixelRatio)
    )
    presentationWidth = Math.round(presentationHeight / imageRatio)
    options.maxWidth = Math.round(options.maxHight / imageRatio)
  }

  // If the users didn't set a default sizes, we'll make one.
  if (!options.sizes) {
    options.sizes = `(max-width: ${presentationWidth}px) 100vw, ${presentationWidth}px`
  }

  // Create sizes (in width) for the image. If the max width of the container
  // for the rendered markdown file is 800px, the sizes would then be: 200,
  // 400, 800, 1200, 1600, 2400.
  //
  // This is enough sizes to provide close to the optimal image size for every
  // device size / screen resolution while (hopefully) not requiring too much
  // image processing time (Sharp has optimizations thankfully for creating
  // multiple sizes of the same input file)
  const sizes = []
  sizes.push(options.maxWidth / 4)
  sizes.push(options.maxWidth / 2)
  sizes.push(options.maxWidth)
  sizes.push(options.maxWidth * 1.5)
  sizes.push(options.maxWidth * 2)
  sizes.push(options.maxWidth * 3)
  const filteredSizes = sizes.filter(size => size < width)

  // Add the original image to ensure the largest image possible
  // is available for small images. Also so we can link to
  // the original image.
  filteredSizes.push(width)

  // Sort sizes for prettiness.
  const sortedSizes = _.sortBy(filteredSizes)

  // Queue sizes for processing.
  const images = sortedSizes.map(size => {
    const arrrgs = {
      ...options,
      width: Math.round(size),
    }
    // Queue sizes for processing.
    if (options.maxHeight) {
      arrrgs.height = Math.round(size * (options.maxHeight / options.maxWidth))
    }

    return queueImageResizing({
      file,
      args: arrrgs, // matey
      reporter,
    })
  })

  const base64Width = 20
  const base64Height = Math.max(1, Math.round(base64Width * height / width))
  const base64Args = {
    duotone: options.duotone,
    grayscale: options.grayscale,
    rotate: options.rotate,
    width: base64Width,
    height: base64Height,
  }

  // Get base64 version
  const base64Image = await base64({ file, args: base64Args, reporter })

  // Construct src and srcSet strings.
  const originalImg = _.maxBy(images, image => image.width).src
  const fallbackSrc = _.minBy(images, image =>
    Math.abs(options.maxWidth - image.width)
  ).src
  const srcSet = images
    .map(image => `${image.src} ${Math.round(image.width)}w`)
    .join(`,\n`)
  const originalName = file.base

  return {
    base64: base64Image.src,
    aspectRatio: images[0].aspectRatio,
    src: fallbackSrc,
    srcSet,
    sizes: options.sizes,
    originalImg: originalImg,
    originalName: originalName,
    density,
    presentationWidth,
    presentationHeight,
  }
}
const reportError = (message, err, reporter) => {
  if (reporter) {
    reporter.error(message, err)
  } else {
    console.error(message, err)
  }

  if (process.env.gatsby_executing_command === `build`) {
    process.exit(1)
  }
}
