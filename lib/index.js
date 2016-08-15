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

/*
 *  Go to the file system and return the uncompiled templates
 */
export function hoganFor (config) {
  const cache = {}
  const array = Reflect.ownKeys(config)
    .map((key) => {
      const KEY = config[key]
      return readFile(KEY)
        .then((string) => {
          cache[key] = string
        })
    })
  return Promise.all(array)
      .then(() => cache)
}

/*
 *  Go to the cache and return the compiled templates
 *  or go to the file system, compile the templates,
 *  then cache and return them
 */
export function getHoganFor (config) {
  const cache = {}
  const array = Reflect.ownKeys(config)
    .map((key) => {
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
