function listToMatrix(list: Uint8ClampedArray, elementsPerSubArray: number) {
  var matrix = [], i, k, n;

  for (i=0; i<list.length/(elementsPerSubArray*4); i++) {
    let rowList = []
    for (k=0; k<elementsPerSubArray; k++) {
      let pixelList = []
      for (n=0; n<4; n++) {
        pixelList.push(list[i*elementsPerSubArray*4 + k*4 + n])
      }
      rowList.push(pixelList)
    }
    matrix.push(rowList)
  }
  
  return matrix;
}


const calcBgToPatternRatio = (pattern: number[][]) => {
  let zeroSum = 0
  let oneSum = 0
  pattern.forEach((row) => {
    row.forEach((pixelCode) => {
      if (pixelCode === 0) {
        zeroSum++
      }
      else {
        oneSum++
      }
    })
  })

  return [zeroSum, oneSum]
}


export const amogussify = (rawImageMatrix: Uint8ClampedArray, imageWidth: number, pattern: number[][]) => {
  let i = 0
  const [zeroSum, oneSum] = calcBgToPatternRatio(pattern)
  if (zeroSum * oneSum === 0) {
    return rawImageMatrix
  }

  const patternPercentage = oneSum / (zeroSum + oneSum)

  let resultImage = listToMatrix(rawImageMatrix, imageWidth)

  resultImage.forEach((row) => {
    amogussifyRow(row, i, pattern, patternPercentage)
    i = (i + 1) % pattern.length
  })

  const flattened = resultImage.flat(3)

  return new Uint8ClampedArray(flattened)
}



const amogussifyRow = (rawRow: number[][], rowIdx: number, pattern: number[][], patternPerc: number) => {
  let j = 0
  // for pixel in rawRow:
  rawRow.forEach((pixel) => {
    amogussifyPixel(pixel, rowIdx, j, pattern, patternPerc)
    j = (j+1) % pattern[0].length
  })
}



const amogussifyPixel = (rawPixel: number[], rowIdx: number, colIdx: number, pattern: number[][], patternPerc: number) => {
  let multiplier = 1
  let decider = 255
  
  if (pattern[rowIdx][colIdx] == 1){
    multiplier = 1 + .1 * (1-patternPerc)
    decider = 255 / multiplier
  }

  else {
    multiplier = 1 - .1 * patternPerc
    decider = 255 / multiplier
  }
  
  const r = rawPixel[0]
  const g = rawPixel[1]
  const b = rawPixel[2]

  const rRev = r>decider ? 255 : r*multiplier
  const gRev = g>decider ? 255 : g*multiplier
  const bRev = b>decider ? 255 : b*multiplier

  rawPixel[0] = rRev
  rawPixel[1] = gRev
  rawPixel[2] = bRev
}