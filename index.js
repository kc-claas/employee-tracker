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
            case 'Add a department':
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
    const departments = await pool.query('SELECT id, name AS department FROM department;');
    console.table(departments.rows);
    proceed();
};

const viewRoles = async () => {
    const roles = await pool.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id;`);
    console.table(roles.rows)
    proceed();
};

const viewEmployees = async () => {
    const query = `WITH RECURSIVE Emp_CTE (id, first_name, last_name, role_id, manager_id, manager_name) AS (SELECT id, first_name, last_name, role_id, manager_id, CAST(NULL AS VARCHAR) FROM employee WHERE manager_id IS NULL UNION ALL SELECT e.id, e.first_name, e.last_name, e.role_id, e.manager_id, CONCAT(Emp_CTE.first_name, ' ',Emp_CTE.last_name) FROM employee e INNER JOIN Emp_CTE on Emp_CTE.id = e.manager_id)`
    const employees = await pool.query(`${query} SELECT Emp_CTE.id, Emp_CTE.first_name AS first, Emp_CTE.last_name AS last, role.title, role.salary, department.name AS department, Emp_CTE.manager_name AS manager FROM Emp_CTE JOIN role ON Emp_CTE.role_id = role.id JOIN department ON role.department_id = department.id;`);
    console.table(employees.rows)
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
        pool.query(`INSERT INTO department (name) VALUES ($1);`, [response.name]);
        console.log(`Department: ${response.name} added.`)
        proceed();
    });
};

const addRole = async () => {
    const departments = (await pool.query('SELECT * From department;')).rows
    const dptArray = departments.map((i) => i.name)
    if (!dptArray) {
        console.log('there are no departments to add this role to')
        proceed()}
    else {
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
            message: 'Which department does this new role belong to?',
            name: 'department',
            type: 'list',
            choices: dptArray
        }
    ])
        .then((response) => {
        const index = departments.findIndex((element) => element.name === response.department)
        pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);`, [response.title, response.salary, departments[index].id]);
        console.log(`Role: ${response.title} added.`)
        proceed();
    })};
};

const addEmployee = async () => {
    const roles = (await pool.query('SELECT * From role;')).rows
    const rolesArray = roles.map((i) => i.title)
    const employees = (await pool.query('SELECT * From employee;')).rows
    const managersArray = ['n/a']
        for (const employee of employees) {
            if (!employee.manager_id)
            {managersArray.push(`${employee.first_name} ${employee.last_name}`)}
        }
    if (!rolesArray) {
        console.log(`There are no roles to assign to this employee`)
        proceed()
    }
    else {
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
            message: 'What is the role of your new employee?',
            name: 'role',
            type: 'list',
            choices: rolesArray
        },
        {
            message: 'Who is the manager of this new employee? Please select n/a if employee is a manager.',
            name: 'manager',
            type: 'list',
            choices: managersArray
        }
    ])
        .then((response) => {
        if (response.manager !== 'n/a') {
            const indexR = roles.findIndex((element) => element.title === response.role)
            const indexM = employees.findIndex((element) => `${element.first_name} ${element.last_name}` === response.manager)
            pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [response.first, response.last, roles[indexR].id, employees[indexM].id]);
        }
        else {
            const indexR = roles.findIndex((element) => element.title === response.role)
            pool.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3);`, [response.first, response.last, roles[indexR].id]);
        }
        console.log(`Employee: ${response.first} ${response.last} added.`)
        proceed();
    })};
};

const updateEmployee = async () => {
    const employees = (await pool.query('SELECT * From employee;')).rows
    const employeesArray = employees.map((i) => `${i.first_name} ${i.last_name}`)

    const roles = (await pool.query('SELECT * From role;')).rows
    const rolesArray = roles.map((i) => i.title)

    await inquirer
        .prompt([
        {
            message: 'Please choose an employee',
            name: 'employee',
            type: 'list',
            choices: employeesArray
        },
        {
            message: 'Please choose a new role',
            name: 'role',
            type: 'list',
            choices: rolesArray
        }
    ])
        .then((response) => {

            const indexE = employees.findIndex((element) => `${element.first_name} ${element.last_name}` === response.employee)
            const indexR = roles.findIndex((element) => element.title === response.role)


        pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roles[indexR].id, employees[indexE].id]);
    });
    console.log(`Employee role updated.`)
        proceed();
};

const proceed = () => {init()}


init();
