/* eslint promise/param-names: 0 */

import fs from 'fs'
import Hogan from 'hogan.js'

const CACHE = {}

const readFile = (filePath) => (
  new Promise((success, failure) => {
    fs.readFile(filePath, 'utf8', (e, string) => {
      if (e) return failure(e)
      success(string)
    })
  })
)

export function getHoganFor (config) {
  const cache = {}
  const array = Reflect.ownKeys(config)
    .map((key, i) => {
      const KEY = config[key]
      return (cache[key] = CACHE[KEY]) ||
        readFile(KEY)
          .then((string) => {
            cache[key] = CACHE[KEY] = Hogan.compile(string)
          })
    })
  return Promise.all(array)
      .then(() => cache)
}
