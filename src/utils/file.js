const sortFiles = filesArr => {
  const reA = /[^a-zA-Z]/g
  const reN = /[^0-9]/g
  const sortAlphaNum = (objA, objB) => {
    const a = objA.name
    const b = objB.name
    const aA = a.replace(reA, '')
    const bA = b.replace(reA, '')
    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ''), 10)
      const bN = parseInt(b.replace(reN, ''), 10)
      return aN === bN ? 0 : aN > bN ? 1 : -1
    } else {
      return aA > bA ? 1 : -1
    }
  }
  return filesArr.sort(sortAlphaNum)
}

const filterAndConvertToArr = files => {
  const arr = []
  for (const file of files) {
    if (file.type.includes('image')) arr.push(file)
  }
  return arr
}

export { sortFiles, filterAndConvertToArr }
