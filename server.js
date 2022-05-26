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
            if (choices === 'Add Department') {
                addDepartment();
            }
            if (choices === 'Add Role') {
                addRole();
            }
            if (choices === 'Add Employee') {
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

// Add a New Department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of your new Department?',
            validate: validate.validateString
        }
    ])
        .then((answer) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            connection.query(sql, answer.newDepartment, (error, response) => {
                if (error) throw error;
                viewAllDepartments();
            });
        });
};

// Add a New Role
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => { deptNamesArray.push(department.department_name); });
        deptNamesArray.push('Create Department');
        inquirer
            .prompt([
                {
                    name: 'departmentName',
                    type: 'list',
                    message: 'Which department is this new role in?',
                    choices: deptNamesArray
                }
            ])
            .then((answer) => {
                if (answer.departmentName === 'Create Department') {
                    this.addDepartment();
                } else {
                    addRoleResume(answer);
                }
            });

        const addRoleResume = (departmentData) => {
            inquirer
                .prompt([
                    {
                        name: 'newRole',
                        type: 'input',
                        message: 'What is the name of your new role?',
                        validate: validate.validateString
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: 'What is the salary of this new role?',
                        validate: validate.validateSalary
                    }
                ])
                .then((answer) => {
                    let createdRole = answer.newRole;
                    let departmentId;

                    response.forEach((department) => {
                        if (departmentData.departmentName === department.department_name) { departmentId = department.id; }
                    });

                    let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    let crit = [createdRole, answer.salary, departmentId];

                    connection.promise().query(sql, crit, (error) => {
                        if (error) throw error;
                        viewAllRoles();
                    });
                });
        };
    });
};

// Add An Employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const crit = [answer.fistName, answer.lastName]
            const roleSql = `SELECT jobrole.id, jobrole.title FROM jobrole`;
            connection.promise().query(roleSql, (error, data) => {
                if (error) throw error;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        connection.promise().query(managerSql, (error, data) => {
                            if (error) throw error;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    crit.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                                    connection.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("Employee has been added!")
                                        viewAllEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// Update An Employee Role
const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, jobrole, department 
    WHERE department.id = jobrole.department_id AND jobrole.id = employee.role_id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

        let sql = `SELECT jobrole.id, jobrole.title FROM jobrole`;
        connection.promise().query(sql, (error, response) => {
            if (error) throw error;
            let rolesArray = [];
            response.forEach((role) => { rolesArray.push(role.title); });

            inquirer
                .prompt([
                    {
                        name: 'updatedEmployee',
                        type: 'list',
                        message: 'Which employee has a new role?',
                        choices: employeeNamesArray
                    },
                    {
                        name: 'updatedRole',
                        type: 'list',
                        message: 'What is their new role?',
                        choices: rolesArray
                    }
                ])
                .then((answer) => {
                    let newTitleId, employeeId;

                    response.forEach((role) => {
                        if (answer.updatedRole === jobrole.title) {
                            newTitleId = jobrole.id;
                        }
                    });

                    response.forEach((employee) => {
                        if (
                            answer.updatedEmployee ===
                            `${employee.first_name} ${employee.last_name}`
                        ) {
                            employeeId = employee.id;
                        }
                    });

                    let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                    connection.query(
                        sqls,
                        [newTitleId, employeeId],
                        (error) => {
                            if (error) throw error;
                            promptUser();
                        }
                    );
                });
        });
    });
};
promptUser();