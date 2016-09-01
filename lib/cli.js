/**
 * @flow
 */

import program from 'commander'

import * as scaffolding from './scaffolding'
import * as building from './building'
import pckjson from '../package.json'

program
  .version(pckjson.version)
  .description(pckjson.description)

program
  .command('new <path>')
  .description('create a new project')
  .option('-o, --overwrite', 'overwrite existing path')
  .action((path: string, options: Object) => {
    scaffolding.createNewProject(path, options)
    .then(files => {
      files.forEach(f => console.log(`created ${f}`))
    })
    .catch((e: Error) => {
      console.error(e.message)
    })
  })

program
  .command('build <path>')
  .description('build a site')
  .action((path: string) => {
    building.buildProject(path)
    .then(result => {
      console.log(result)
    }).
    catch((e: Error) => {
      console.error(e.message)
    })
  })

/**
 * Start the program.
 */
export default function cli(argv: Array<string>) {
  if (argv.length < 3) {
    program.help()
  } else {
    program.parse(argv)
  }
}
