import React from 'react'

const stitchProcessing = (
  canvasList,
  avgHeight,
  canvasRefs,
  resize,
  dimensions
) => {
  const processedCanvases = []
  console.log(resize, dimensions)
  const resizeWidth = resize.scaleDown ? dimensions.w.min : dimensions.w.max
  console.log(resizeWidth)
  const combineSlicedImgs = arr => {
    const canvas = document.createElement('canvas')
    const canvases = []
    let joinedHeight = 0,
      joinedWidth = 0
    for (let i = 0; i < arr.length; i++) {
      const cvs = arr[i],
        cvsObj = {
          canvas: cvs,
          oWidth: cvs.width,
          oHeight: cvs.height
        }
      joinedWidth = cvs.width

      canvases.push(cvsObj)
    }
    for (let i = 0; i < canvases.length; i++) {
      const cvsObj = canvases[i]
      cvsObj.nWidth = joinedWidth

      cvsObj.nHeight = (cvsObj.nWidth * cvsObj.oHeight) / cvsObj.oWidth
      joinedHeight += cvsObj.nHeight
    }

    canvas.width = joinedWidth
    canvas.height = joinedHeight
    const ctx = canvas.getContext('2d'),
      Left = 0
    let Top = 0
    for (let i = 0; i < canvases.length; i++) {
      ctx.drawImage(canvases[i].canvas, Left, Top)
      Top += canvases[i].nHeight
    }

    return canvas
  }

  const combineSmallerImgs = (first, height, images) => {
    let comb = first

    while (comb.height < height && images.length >= 1) {
      const next = images.shift()
      comb = combineSlicedImgs([comb, next])
    }
    return comb
  }

  const comparePixels = (old, curr) => {
    const threshold = 0
    const diff = Math.sqrt(
      Math.pow(curr.r - old.r, 2) +
        Math.pow(curr.g - old.g, 2) +
        Math.pow(curr.b - old.b, 2)
    )
    return !(diff > threshold)
  }

  const verifyLastRowColor = (canvas, avgH) => {
    const height = avgH || canvas.height,
      { width } = canvas,
      ctx = canvas.getContext('2d'),
      { data } = ctx.getImageData(0, height - 1, width, 1)

    let curr,
      prev,
      slice = true,
      currPixel = 0

    const NEXT_PIXEL = 4,
      red = 0,
      green = 1,
      blue = 2,
      alpha = 3

    while (currPixel < data.length) {
      curr = {
        r: data[currPixel + red],
        g: data[currPixel + green],
        b: data[currPixel + blue],
        a: data[currPixel + alpha]
      }

      if (!!prev && !comparePixels(prev, curr)) return

      prev = curr
      currPixel += NEXT_PIXEL
    }
    return slice
  }

  const processFinalCanvas = ({ sourceCan, i, width, height }) => {
    const canvas = createCanvas(i, width, height)
    processedCanvases.push({ canvas, sourceCan, i, width, height })
  }

  const createCanvas = (i, width, height) => {
    const canvas = (
      <canvas
        key={i}
        width={width}
        height={height}
        className='processed-canvas'
        ref={ref => {
          canvasRefs[i] = ref
        }}
      />
    )
    return canvas
  }

  const sliceCanvas = (combCan, sliceHeight) => {
    const { height, width } = combCan,
      remainingCan = document.createElement('canvas'),
      remainingH = height - sliceHeight,
      rCtx = remainingCan.getContext('2d'),
      canvasAttributes = {
        sourceCan: combCan,
        i: processedCanvases.length,
        width,
        height: sliceHeight
      }

    processFinalCanvas(canvasAttributes)

    remainingCan.width = width
    remainingCan.height = remainingH
    rCtx.drawImage(
      combCan,
      0,
      sliceHeight - 1,
      width,
      remainingH,
      0,
      0,
      width,
      remainingH
    )
    return remainingCan
  }

  const findSLiceLocation = (first, avgHeight) => {
    let sliceHeight = avgHeight
    let remainingCan = first
    while (sliceHeight < first.height) {
      if (verifyLastRowColor(first, sliceHeight) === true) {
        const padding = sliceHeight + 40
        if (
          verifyLastRowColor(first, padding) === true &&
          padding < first.height
        ) {
          sliceHeight = padding
        }
        remainingCan = sliceCanvas(first, sliceHeight)
        break
      }
      sliceHeight += 10
    }
    return remainingCan
  }

  const recurse = (canvases, avgHeight) => {
    const cnvsCopy = canvases
    let first = cnvsCopy.shift()
    first = combineSmallerImgs(first, avgHeight, cnvsCopy)
    if (cnvsCopy.length === 0) {
      processFinalCanvas({
        sourceCan: first,
        i: processedCanvases.length,
        width: first.width,
        height: first.height
      })
      return
    } else if (verifyLastRowColor(first, avgHeight)) {
      if (first.height <= avgHeight) {
        processFinalCanvas({
          sourceCan: first,
          i: processedCanvases.length,
          width: first.width,
          height: first.height
        })
      } else {
        const remainingCan = findSLiceLocation(first, avgHeight)
        cnvsCopy.unshift(remainingCan)
      }
    } else {
      const second = cnvsCopy.shift()
      const combined = combineSlicedImgs([first, second])
      first = combineSmallerImgs(combined, avgHeight, cnvsCopy)
      const remainingCan = findSLiceLocation(first, avgHeight)
      cnvsCopy.unshift(remainingCan)
    }
    recurse(cnvsCopy, avgHeight)
  }
  recurse(canvasList, avgHeight)

  return { processedCanvases }
}

export default stitchProcessing