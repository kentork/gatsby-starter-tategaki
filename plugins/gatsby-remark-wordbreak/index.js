const visit = require(`unist-util-visit`)
const kuromoji = require('kuromoji')

let tokenizer = null

module.exports = async ({ markdownAST }) => {
  if (tokenizer === null) {
    tokenizer = await new Promise((resolve, reject) => {
      kuromoji
        .builder({ dicPath: 'node_modules/kuromoji/dict/' })
        .build((err, tokenizer) => {
          resolve(tokenizer)
        })
    })
  }

  visit(markdownAST, `text`, node => {
    if (node.value.length > 1) {
      let pragraphs = []
      let p = ''
      const tokens = tokenizer.tokenize(node.value)

      for (let i = 0; i < tokens.length; i++) {
        const morpheme = tokens[i]

        if (
          morpheme.pos === '助詞' ||
          morpheme.pos_detail_1 === '句点' ||
          morpheme.pos_detail_1 === '読点' ||
          morpheme.pos_detail_1 === '括弧閉' ||
          morpheme.pos_detail_1 === '空白'
        ) {
          if (
            tokens[i + 1] &&
            (tokens[i + 1].pos_detail_1 === '句点' ||
              tokens[i + 1].pos_detail_1 === '読点' ||
              tokens[i + 1].pos_detail_1 === '括弧閉' ||
              tokens[i + 1].pos_detail_1 === '空白')
          ) {
            p = p + morpheme.surface_form
          } else {
            pragraphs.push(p + morpheme.surface_form)
            p = ''
          }
        } else {
          p = p + morpheme.surface_form
        }
      }
      if (p !== '') pragraphs.push(p)

      node.type = `html`
      node.value = pragraphs
        .map(w => `<span class="morpheme">${w}</span>`)
        .join('<wbr/>')
    }
  })
}
