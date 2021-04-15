import * as allRuntypes from './sharedTypes/runtypes'
import fs from 'fs'

const toTypeScriptExport = (name: string) => {
  /*
  let string = runtype.toString()
  string = string.replace('Runtype<', '').replace('>', '').replace(/;/g, '\n')
  string = `export interface ${name} ${string}`
  return string
  */
  return `export type ${name} = Static<typeof allRuntypes.${name}>`
}

const allToTs = () => {
  let finalString =
    "import * as allRuntypes from './runtypes'\nimport { Static } from 'runtypes' \n\n"
  finalString =
    finalString +
    Object.keys(allRuntypes)
      .map((key) => toTypeScriptExport(key))
      .join('\n\n')

  fs.writeFileSync('./src/sharedTypes/typesFromRuntypes.ts', finalString)
  fs.writeFileSync('./src/sharedTypes/dummy', 'dummy file that just updates files')
}

allToTs()
