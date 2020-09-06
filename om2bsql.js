#!/usr/bin/env node
/*
 *    SQL tools to export and import .sql files
 *    Copyright (C) 2020  Jonas Hügli
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as published
 *    by the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
//
// Requirements
const { exporting }                 = require('./src')
const { importingGui, importing }   = require('./src')
const { version, description }      = require('./package.json')
const { list }                      = require('./src')
const { exec }                      = require('child_process')
const yargs                         = require('yargs')
const path                          = require('path')
const os                            = require('os').platform()
const fs                            = require('fs')

//
// Constants
const currentVersion                = 'Current version: v' + version
const year                          = new Date().getFullYear()
const copyright                     = ('2020' != year) ? 'Copyright @ 2020-' + year : 'Copyright @ 2020'

var testSql = exec('mysql', function(error, stdout, stderr) {
    if(stderr) {
        if(/is not recognized/.test(stderr) || /command not found/.test(stderr)) {
            console.info("The MySQL command seems not to be recognized. Please add the directory containing \n" +
                            "the binary/exe mysql and mysqldump to your environment variables:\n" +
                            "- On Linux and OS X, type the command 'export PATH=$PATH:/place/to/the/binaries'.\n" +
                            `- On Windows, run powershell.exe/cmd.exe in administrator mode and type 'setx PATH "C:\\my\\mysql\\exe\\directory;%PATH%"'`
                            )
            process.exit()
        }
    }
})

//
// yargs initialization
var argv = yargs
    .usage('Usage: $0 <command> [options]')
    .version(currentVersion).alias('v', 'version')
    .help('h').alias('h', 'help')
    .describe('version', 'Show the current version number')
    .command('export', 'Export database(s) and/or table(s)')
    .command('import', 'Import database(s) and/or table(s)')
    .command('list', 'List all databases or tables in a database')
    .example([
        ['om2bsql list', 'List'],
        ['om2bsql export', 'Exporting'],
        ['om2bsql import', 'Importing']
    ])
    .epilog(copyright)
    .argv

if(yargs.argv._[0] === 'list') {
    list()
}
else if(yargs.argv._[0] === 'export') {
    exporting()
}
else if(yargs.argv._[0] === 'import') {
    importing()
}
else if(yargs.argv._[0]) {
    console.log(`Unknown command: ${yargs.argv._[0]}.\nType om2bsql --help to see the help`)
}