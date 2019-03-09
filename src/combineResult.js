/**
 * Combine results to text blocks
 * @param {*} result
 * @returns {Array<string>}
 */
function combineResults(result) {
  const lines = [];
  const blocks = [];
  const fullTextAnnotation = result[0].fullTextAnnotation;
  if (fullTextAnnotation !== null) {
    fullTextAnnotation.pages[0].blocks.forEach(block => {
      let bl = [];
      block.paragraphs.forEach(paragraph => {
        let line = "";
        paragraph.words.forEach(word => {
          word.symbols.forEach(symbol => {
            line += symbol.text;
            if (symbol.property && symbol.property.detectedBreak) {
              if (symbol.property.detectedBreak.type === "SPACE") {
                line += " ";
              } else if (
                symbol.property.detectedBreak.type === "EOL_SURE_SPACE"
              ) {
                line += "";
                lines.push(line);
                bl.push(line);
                line = "";
              } else if (symbol.property.detectedBreak.type === "LINE_BREAK") {
                lines.push(line);
                bl.push(line);
                line = "";
              }
            }
          });
        });
      });
      blocks.push(bl);
    });
  }
  return blocks;
}

module.exports = combineResults;
