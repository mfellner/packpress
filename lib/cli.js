import program from 'commander'

import * as scaffolding from './scaffolding'
import pckjson from '../package.json'

program
  .version(pckjson.version)
  .description(pckjson.description)

program
  .command('build')
  .description('build the site')
  .action(() => {
    console.log('build')
  })

program
  .command('new <path>')
  .description('create a new project')
  .option('-o, --overwrite', 'overwrite existing path')
  .action((path, options) => {
    scaffolding.createNewProject(path, options).
    then(files => {
      files.forEach(f => console.log(`created ${f}`))
    }).
    catch(e => {
      console.error(e.message)
    })
  })

program
  .command('build <path>')
  .description('build a site')
  .action((path) => {
    building.buildProject(path).
    then(result => {
      console.log(result)
    }).
    catch(e => {
      console.error(e.message)
    })
  })

export default function cli(argv) {
  if (argv.length < 3) {
    program.help()
  } else {
    program.parse(argv)
  }
}
