import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';



await connectToDb();