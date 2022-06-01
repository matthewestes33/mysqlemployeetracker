// Variables to require npm dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'week12bootc@mp',
        database: 'enterprise'
    },
    console.log(`Connected to the enterprise database.`)
);

// Function for initiating the user prompt with menu choices 
const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Welcome to enterprise! What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;
            if (choices === 'View All Departments') {
                viewAllDepartments();
            }
            if (choices === 'View All Roles') {
                viewAllRoles();
            }
            if (choices === 'View All Employees') {
                viewAllEmployees();
            }
            if (choices === 'Add A Department') {
                addDepartment();
            }
            if (choices === 'Add A Role') {
                addRole();
            }
            if (choices === 'Add An Employee') {
                addEmployee();
            }
            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }
            if (choices === 'Exit') {
                connection.end();
            }
        });
};

// View all Departments (async)
const viewAllDepartments = async () => {
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentList = [];
            res.forEach(department => departmentList.push(department));
            console.table(departmentList);
            promptUser();
        });
    } catch (err) {
        console.log(err);
        promptUser();
    };
}

//View all Roles (async)
const viewAllRoles = async () => {
    try {
        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleList = [];
            res.forEach(role => roleList.push(role));
            console.table(roleList);
            promptUser();
        });
    } catch (err) {
        console.log(err);
        promptUser();
    };
}

// View All Employees (async)
const viewAllEmployees = async () => {
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeList = [];
            res.forEach(employee => employeeList.push(employee));
            console.table(employeeList);
            promptUser();
        });
    } catch (err) {
        console.log(err);
        promptUser();
    };
}

// Add a New Department (async)
const addDepartment = async () => {
    try {
        let answer = await inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What department would you like to add?'
            }
        ]);

        let result = await connection.promise().query("INSERT INTO department SET ?", {
            name: answer.name
        });

        console.log(`${answer.name} added successfully to department list.`)
        viewAllDepartments();

    } catch (err) {
        console.log(err);
        promptUser();
    };
}

// Add a New Role
const addRole = async () => {
    try {
        let dept = await connection.promise().query('SELECT * FROM department')
        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What role would you like to add?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What salary will be earned in this role?'
            },
            {
                name: 'department_id',
                type: 'list',
                choices: dept.map((department_id) => {
                    return {
                        name: department_id.name,
                        value: department_id.id
                    }
                }),
                message: 'What department does this role belong to?',
            }
        ]);
        
        let roleDept;
        for (i = 0; i < dept.length; i++) {
            if(dept[i].department_id === answer.choice) {
                roleDept = dept[i];
            };
        }
        let result = await connection.promise().query('INSERT INTO role SET ?', {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.deptID
        })

        console.log(`${answer.title} added successfully to roles.`)
        viewAllRoles();

    } catch (err) {
        console.log(err);
        promptUser();
    };
}

// Add An Employee
// const addEmployee = () => 

// Update An Employee Role
// const updateEmployeeRole = () => 

promptUser();