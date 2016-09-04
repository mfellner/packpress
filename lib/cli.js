/**
 * @flow
 */

import program from 'commander'

import * as scaffolding from './scaffolding'
import * as building from './building'
import * as blogging from './blogging'
import packagejson from '../package.json'

program
  .version(packagejson.version)
  .description(packagejson.description)

program
  .command('new <path>')
  .description('create a new project')
  .option('-o, --overwrite', 'overwrite existing path')
  .action((path: string, options: Object) => {
    scaffolding.createNewProject(path, options)
      .then(files =>
        files.forEach(f => console.log(`created ${f}`))
      )
      .catch((e: Error) =>
        console.error(e.message)
      )
  })

program
  .command('build <path>')
  .description('build a project')
  .action((path: string) => {
    building.buildProject(path)
      .then(result =>
        console.log(result)
      )
      .catch((e: Error) =>
        console.error(e.message)
      )
  })

program
  .command('post <title>')
  .description('create a new blog post')
  .option('-p, --path [path]', 'project path')
  .action((title: string, options: Object) => {
    blogging.createPost(title, options)
      .then(result =>
        console.log(result)
      )
      .catch((e: Error) =>
        console.error(e.message)
      )
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

// $FlowIssue https://github.com/facebook/flow/issues/1362
if (require.main === module) {
  cli(process.argv)
}
