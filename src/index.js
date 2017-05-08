#!/usr/bin/env node

import { writeFile, readFile } from 'fs'
import mkdirp from 'mkdirp'

function copyPackageJson(outDir) {
  try {
    const pkgJson = `./package.json`
    findFile(pkgJson).then((result) => {
      const outFolder = `${outDir}`
      const outFile = `${outDir}/package.json`

      mkdirPromise(outFolder).then(() => {
        console.log(`${pkgJson} -> ${outFile}`)
        substitutePackageJson(outFile, result.result)
      }).catch((err) => {
        throw err
      })
    }).catch(err => {
      throw err
    })
  } catch (err) {
    throw err
  }
}

function substitutePackageJson(outFile, data, options) {
  const obj = JSON.parse(data)
  if (obj.version.toLowerCase().endsWith('snapshot')) {
    obj.version = obj.version + '.' + Date.now()
  }
  writeFile(outFile, JSON.stringify(obj, null, 2), (err) => {
    if (err) {
      throw err
    }
  })
}

function findFile(file) {
  return new Promise((resolve, reject) => {
    readFile(file, 'utf8', (err, result) => {
      if (err) {
        reject(err)
      }
      resolve({file, result})
    })
  })
}

const mkdirPromise = dir => new Promise((resolve, reject) => {
  mkdirp(dir, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve({dir})
    }
  })
})

if (process.argv.length < 3) {
  console.log(`Usage: ${process.argv[1]} <destination-dir>`)
  process.exit(-1)
}

copyPackageJson(process.argv[2])
