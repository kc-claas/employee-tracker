import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
await connectToDb();
const init = () => {
    inquirer
        .prompt([
        {
            message: 'what would you like to do?',
            type: 'list',
            name: 'choice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])
        .then((response) => {
        switch (response.choice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a deparment':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
                break;
            case 'Exit':
                process.exit(1)
        }
    });
};

const viewDepartments = async () => {
    const departments = await pool.query('SELECT * FROM department;');
    console.log(departments);
};

const viewRoles = async () => {
    const roles = await pool.query('SELECT * FROM role;');
    console.log(roles)
    proceed();
};

const viewEmployees = async () => {
    const employees = await pool.query('SELECT * FROM employee;');
    console.log(employees)
    proceed();
};

const addDepartment = async () => {
    await inquirer
        .prompt([
        {
            message: 'What is your new department called?',
            name: 'name',
            type: 'input'
        }
    ])
        .then((response) => {
        pool.query('INSERT INTO department (name) VALUE ($1);', [response.name]);
        console.log(`Department: ${response.name} added.`)
        proceed();
    });
};

const addRole = async () => {
    await inquirer
        .prompt([
        {
            message: 'What is the title of your new role?',
            name: 'title',
            type: 'input'
        },
        {
            message: 'What is the salary of your new role?',
            name: 'salary',
            type: 'input'
        },
        {
            message: 'What is the department id number for your new role?',
            name: 'department',
            type: 'input'
        }
    ])
        .then((response) => {
        pool.query('INSERT INTO role (title, salary, department_id) VALUE ($1, $2, $3);', [response.title, response.salary, response.department]);
        console.log(`Role: ${response.title} added.`)
        proceed();
    });
};

const addEmployee = async () => {
    await inquirer
        .prompt([
        {
            message: 'What is the first name of your new employee?',
            name: 'first',
            type: 'input'
        },
        {
            message: 'What is the last name of your new employee?',
            name: 'last',
            type: 'input'
        },
        {
            message: 'What is the role id number of your new employee?',
            name: 'role',
            type: 'input'
        },
        {
            message: 'What is the manager id number of your new employee? Please leave blank if employee is a manager.',
            name: 'manager',
            type: 'input'
        }
    ])
        .then((response) => {
        if (response.manager) {
            pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ($1, $2, $3, $4);', [response.first, response.last, response.role, response.manager]);
        }
        else {
            pool.query('INSERT INTO employee (first_name, last_name, role_id) VALUE ($1, $2, $3);', [response.first, response.last, response.role]);
        }
        console.log(`Employee: ${response.first} ${response.last} added.`)
        proceed();
    });
};

const updateEmployee = async () => {
    await inquirer
        .prompt([
        {
            message: 'Please enter id of employee.',
            name: 'employee',
            type: 'input'
        },
        {
            message: 'Please enter the id of their new role',
            name: 'role',
            type: 'input'
        }
    ])
        .then((response) => {
        pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [response.role, response.employee]);
    });
    console.log(`Employee role updated.`)
        proceed();
};


const proceed = () =>
    inquirer
    .prompt([{
        message: 'Press enter to continue',
        name: 'confirm'
    }])
    .then(init())

init();
