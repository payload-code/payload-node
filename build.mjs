import esbuild from 'esbuild'
import fs, { promises as fsp } from 'fs'
import { transform } from 'sucrase'
import pkg from './package.json' assert { type: "json" }

const entryPoints =  ['payload.js']

async function cjsConvert() {
  const mjsFiles = (await fsp.readdir('lib/mjs'))

  mjsFiles.forEach(async function(file) {
      const path = `lib/mjs/${file}`
      const contents = (await fsp.readFile(path)).toString()

      if (file.endsWith('.js')) {
          const result = transform(contents, {
            filePath: path,
            transforms: ['imports'],
            sourceMapOptions: {
              compiledFilename: path,
            }
          })

          await fsp.writeFile(`lib/cjs/${file}`, result.code)

      } else if (file.endsWith('.map'))
          await fsp.writeFile(`lib/cjs/${file}`, contents)

  })
}

async function build(packageType) {

  const buildParams = {
    entryPoints: entryPoints.map(e=>`src/${e}`),
    bundle: true,
    sourcemap: true,
    minify: true,
    outdir: `lib/mjs`,
    splitting: true,
    format: 'esm',
    target: ['esnext'],
    platform: 'node',
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
  }

  await esbuild.build(buildParams)

  if (!fs.existsSync('lib/cjs')) {
    fs.mkdirSync('lib/cjs')
  }

  await cjsConvert()

  await fsp.writeFile(`lib/mjs/package.json`, `{"type": "module"}`)
  await fsp.writeFile(`lib/cjs/package.json`, `{"type": "commonjs"}`)
}

build()

