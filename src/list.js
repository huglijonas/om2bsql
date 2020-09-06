const inquirer  = require('inquirer')
const { exec }  = require('child_process')

function list() {
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
                                name: 'type',
                                type: 'list',
                                message: 'What do you want to list?',
                                choices: ['Databases', 'Tables']
                            },
                        ])
                        .then(answers => {
                            if(answers.type === 'Databases') {
                                exec(`mysql -u ${credentials.username} -p${credentials.password} -e "show databases;"`, function(error, stderr, stdout) {
                                    if(error===null) {
                                        var databases = stderr.split('\n')
                                        for(i = 1; i<databases.length-1;i++) {
                                            console.log(`[${i}] ${databases[i]}`)
                                        }
                                    }
                                })
                            }
                            else if(answers.type === 'Tables') {
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
                                                    message: 'From which database do you want to list the tables?',
                                                    choices: databases
                                                }
                                            ])
                                            .then(db => {
                                                exec(`mysql -u ${credentials.username} -p${credentials.password} -e "use ${db.name}; show tables;"`, function(error, stderr, stdout) {
                                                    if(error===null) {
                                                        var tables = stderr.split('\n')
                                                        for(i = 1; i<tables.length-1;i++) {
                                                            console.log(`[${i}] ${tables[i]}`)
                                                        }
                                                    }
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
    list,
}
