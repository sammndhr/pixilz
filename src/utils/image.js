const findMinMax = (curr, { min, max }) => {
  const minMax = { min: min, max: max }
  if (min === 0 || curr < min) {
    minMax['min'] = curr
  }
  if (max === 0 || curr > max) {
    minMax['max'] = curr
  }
  return minMax
}

const calculateDimensions = images => {
  let totalHeight = 0,
    totalWidth = 0,
    minMaxWidth,
    minMaxHeight
  const len = images.length
  for (let i = 0; i < len; i++) {
    const img = images[i]
    img.removeAttribute('width')
    img.removeAttribute('height')
    totalHeight += img.height
    totalWidth += img.width
    if (!minMaxWidth || !minMaxHeight) {
      minMaxWidth = minMaxHeight = { min: 0, max: 0 }
    }
    minMaxWidth = findMinMax(img.width, minMaxWidth)
    minMaxHeight = findMinMax(img.height, minMaxHeight)
  }
  return {
    width: { ...minMaxWidth, avg: Math.round(totalWidth / len) },
    height: { ...minMaxHeight, avg: Math.round(totalHeight / len) }
  }
}
export default { calculateDimensions }
