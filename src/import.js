const inquirer  = require('inquirer')
const { exec }  = require('child_process')
const fs        = require('fs')

function importing(username, password) {
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
                                name: 'path',
                                type: 'input',
                                message: 'Where is the file you want to import? ',
                                validate: function(val) {
                                    return ((fs.existsSync(val)) && (val.substring(val.length - 4) == '.sql')) ? true : "File does not exist!"
                                }
                            },
                            {
                                name: 'type',
                                type: 'list',
                                message: 'Do you want to export table(s) or database(s)?',
                                choices: ['Database(s)', 'Table(s)']
                            },
                        ])
                        .then(answers => {
                            if(answers.type === 'Database(s)') {
                                inquirer
                                    .prompt([
                                        {
                                            name: 'choice',
                                            type: 'list',
                                            message: 'Is there the database creation statement in the .sql file? ',
                                            choices: ['Yes', 'No']
                                        }
                                    ])
                                    .then(db => {
                                        if(db.choice === 'No') {
                                            console.log('You cannot import a database without the creation statement in the .sql file!')
                                            process.exit()
                                        }
                                        else if(db.choice === 'Yes') {
                                            exec(`mysql -u ${credentials.username} -p${credentials.password} < ${answers.path}`, function(error, stderr, stdout) {
                                                if(error===null) {
                                                    console.log('The importation has been achieved!')
                                                    process.exit()
                                                } else {
                                                    console.log(error.message)
                                                    process.exit()
                                                }
                                            })
                                        }
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
                                                    name: 'database',
                                                    type: 'list',
                                                    message: 'In which database do you want to import table(s)? ',
                                                    choices: databases
                                                }
                                            ])
                                            .then(answer => {
                                                exec(`mysql -u ${credentials.username} -p${credentials.password} ${answer.database} < ${answers.path}`, function(error, stderr, stdout) {
                                                    if(error===null) {
                                                        console.log('The importation has been achieved!')
                                                        process.exit()
                                                    }
                                                    else {
                                                        console.log(error.message)
                                                        process.exit()
                                                    }
                                                })
                                            })
                                    } else {
                                        console.log(error.message)
                                        process.exit()
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
    importing,
}
