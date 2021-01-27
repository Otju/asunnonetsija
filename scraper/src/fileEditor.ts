const fs = require('fs')

type FileType = 'CSV' | 'JSON'

export const readFromFile = (fileName: string, fileType: FileType) => {
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
}

export const writeToFile = (
  fileName: string,
  value: Array<string | Object>,
  fileType: FileType
) => {
  let newValue: string
  switch (fileType) {
    case 'CSV':
      newValue = value.join(',')
      break
    case 'JSON':
      newValue = JSON.stringify(value)
      break
    default:
      throw Error('Invalid file type')
  }
  fs.writeFileSync(`./src/data/${fileName}`, newValue)
  console.log(`Succesfully wrote ${fileName}`)
}
