const inquirer  = require('inquirer')
const { exec }  = require('child_process')
const fs        = require('fs')

function exporting() {
    var res
    
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'username',
                default: 'root',
                message: 'Enter the database\'s user: ',
                validate: function(val) {
                    return (/[\x00-\x7F]{4,32}/.test(val)) ? true : 'Only ASCII chars are allowed (4 to 32 characters)'
                }
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter the database\'s password: ' ,
                validate: function(val) {
                    return (/[\x00-\x7F]{4,128}/.test(val)) ? true : 'Only ASCII chars are allowed (4 to 128 characters)'
                }
            },
        ])
        .then(credentials => {
            exec(`mysql -u ${credentials.username} -p${credentials.password} -e "exit"`, function(error, stderr, stdout) {
                if(error===null) {
                    console.log('Connection was correctly established!')
                    
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'path',
                                default: process.cwd() + '/sql',
                                message: 'Where do you want to create the dump file? ',
                                validate: function(val) {
                                    return (fs.existsSync(val)) ? true : "Directory does not exist!"
                                }
                            },
                            {
                                type: 'input',
                                name: 'filename',
                                default: 'export_' + Date.now() + '.sql',
                                message: 'Enter the export filename: ',
                                validate: function(val) {
                                    return (/[\x00-\x7F]+/.test(val)) ? true : 'Only ASCII chars are allowed'
                                }
                            },
                            {
                                name: 'type',
                                type: 'list',
                                message: 'Do you want to export table(s), a database or all databases?',
                                choices: ['Database(s)', 'Table(s)', 'All']
                            },
                        ])
                        .then(answers => {
                            if(answers.type === 'All') {
                                exec(`mysqldump -u ${credentials.username} -p${credentials.password} --all-databases --add-drop-database > ${answers.path + '/' + answers.filename}`, function(error, stderr, stdout) {
                                    if(error===null) {
                                        console.log(`The export has been achieved! The file can be found at the following path : ${answers.path + '/' + answers.filename}`)
                                    } else console.log(error.message)
                                })
                            }
                            else if(answers.type === 'Database(s)') {
                                exec(`mysql -u ${credentials.username} -p${credentials.password} -e "show databases;"`, function(error, stderr, stdout) {
                                    if(error===null) {
                                        res = stderr.split('\n')
                                        var databases = new Array()
                                        for(i=1;i<res.length-1;i++) { databases.push(res[i]) }

                                        inquirer
                                            .prompt([
                                                {
                                                    name: 'database',
                                                    type: 'checkbox',
                                                    message: 'Which database(s) do you want to export?',
                                                    choices: databases
                                                }
                                            ])
                                            .then(answer => {
                                                answer.database = answer.database.join(' ')
                                                exec(`mysqldump -u ${credentials.username} -p${credentials.password} --databases ${answer.database} --add-drop-database > ${answers.path + '/' + answers.filename}`, function(error, stderr, stdout) {
                                                    if(error===null) {
                                                        console.log(`The export has been achieved! The file can be found at the following path : ${answers.path + '/' + answers.filename}`)
                                                    } else console.log(error.message)
                                                })
                                            })
                                    } else console.log(error.message)
                                })
                            }
                            else if(answers.type === 'Table(s)') {
                                exec(`mysql -u ${credentials.username} -p${credentials.password} -e "show databases;"`, function(error, stderr, stdout) {
                                    if(error===null) {
                                        res = stderr.split('\n')
                                        var databases = new Array()
                                        for(i=1;i<res.length-1;i++) { databases.push(res[i]) }

                                        inquirer
                                            .prompt([
                                                {
                                                    name: 'name',
                                                    type: 'list',
                                                    message: 'From Which database do you want to export the tables?',
                                                    choices: databases,
                                                    validate(val) {
                                                        return (val.length > 0) ? true : false
                                                    }
                                                }
                                            ])
                                            .then(db => {
                                                exec(`mysql -u ${credentials.username} -p${credentials.password} -e "use ${db.name}; show tables;"`, function(error, stderr, stdout) {
                                                    if(error===null) {
                                                        res = stderr.split('\n')
                                                        var tables = new Array()
                                                        for(i=1;i<res.length-1;i++) { 
                                                            tables.push(res[i]) 
                                                        }

                                                        inquirer
                                                            .prompt([
                                                                {
                                                                    name: 'tables',
                                                                    type: 'checkbox',
                                                                    message: 'Which table(s) do you want to export? ',
                                                                    choices: tables
                                                                }
                                                            ])
                                                            .then(tb => {
                                                                tb.tables = tb.tables.join(' ')

                                                                exec(`mysqldump -u ${credentials.username} -p${credentials.password} --databases ${db.name} --tables ${tb.tables} --add-drop-database > ${answers.path + '/' + answers.filename}`, function(error, stderr, stdout) {
                                                                    if(error===null) {
                                                                        console.log(`The export has been achieved! The file can be found at the following path : ${answers.path + '/' + answers.filename}`)
                                                                    } else console.log(error.message)
                                                                })
                                                            })
                                                    } else console.log(error.message)
                                                })
                                            })
                                    }
                                })
                            }
                        })
                    
                }
                else {
                    console.log('There are possibly two problems: the credentials are not correct or')
                    console.log('is MySQL not installed on the actual computer (127.0.0.1/localhost)?')
                }
            })
        })
}

module.exports = {
    exporting,
}