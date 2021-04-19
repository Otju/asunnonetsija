const fs = require('fs')

type FileType = 'CSV' | 'JSON'

export const readFromFile = (fileName: string, fileType: FileType) => {
  try {
    let data = fs.readFileSync(`./src/data/${fileName}`, 'utf8')
    switch (fileType) {
      case 'CSV':
        data = data.split(',')
        break
      case 'JSON':
        data = JSON.parse(data)
        break
      default:
        throw Error('Invalid file type')
    }
    return data
  } catch {
    console.log('File missing ', fileName)
    return []
  }
}

export const writeToFile = (
  fileName: string,
  value: Array<string | Object> | Object,
  fileType: FileType,
  writeToAssets?: boolean
) => {
  let newValue: string
  switch (fileType) {
    case 'CSV':
      //@ts-ignore
      newValue = value.join(',')
      break
    case 'JSON':
      newValue = JSON.stringify(value)
      break
    default:
      throw Error('Invalid file type')
  }
  fs.writeFileSync(`./src/data/${fileName}`, newValue)
  if (writeToAssets) {
    fs.writeFileSync(`../frontend/src/assets/${fileName}`, newValue)
  }
  console.log(`Succesfully wrote ${fileName}`)
}
