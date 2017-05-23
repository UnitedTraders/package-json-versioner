#!/usr/bin/env node

import fs, { writeFile, readFile } from 'fs-extra'
import mkdirp from 'mkdirp'

function copyDistFiles (packageJsonContent, outDir) {
  return new Promise((resolve) => {
    const packageContent = JSON.parse(packageJsonContent)
    if (!packageContent.files) {
      throw new Error('\'files\' section doesn\'t present in package.json')
    }
    packageContent.files
      .forEach(file => {
        fs.copySync('./' + file, outDir + '/' + file)
      })

    resolve()
  })
}

function copyPackageJson (outDir) {
  const pkgJson = `./package.json`
  findFile(pkgJson)
    .then((result) => {
      const outFolder = `${outDir}`
      const outFile = `${outDir}/package.json`

      return mkdirPromise(outFolder)
        .then(() => {
          return copyDistFiles(result.result, outDir)
        })
        .then(() => {
          console.log(`${pkgJson} -> ${outFile}`)
          substitutePackageJson(outFile, result.result)
        })
    })
    .catch(err => {
      console.error(`Error occured ${err}`)
      process.exit(1)
    })
}

function substitutePackageJson (outFile, data, options) {
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

function findFile (file) {
  return new Promise((resolve, reject) => {
    readFile(file, 'utf8', (err, result) => {
      if (err) {
        reject(err)
      }
      resolve({file, result})
    })
  })
}

function mkdirPromise (dir) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve({dir})
    })
  })
}

if (process.argv.length < 3) {
  console.log(`Usage: ${process.argv[1]} <destination-dir>`)
  process.exit(-1)
}

const tempPublishDir = process.argv[2]

copyPackageJson(tempPublishDir)
