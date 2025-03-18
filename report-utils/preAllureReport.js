const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define the file paths
const dirPath = path.join(__dirname, '../allure-results');
const filePath = path.join(dirPath, 'environment.properties');
const historySrc = path.join(__dirname, '../allure-report', 'history');
const historyDest = path.join(dirPath, 'history');
const categoriesSrc = path.join(__dirname, '../report-utils', 'categories.json');
const categoriesDest = path.join(dirPath, 'categories.json');

// Ensure the directory exists
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// Read ENV from .env file
const environment = process.env.ENV || 'Unknown';

// Define content to be written
const content = `environment=${environment}`;

// Write the file
fs.writeFileSync(filePath, content, 'utf8');

// Copy history folder if it exists
if (fs.existsSync(historySrc)) {
    fs.rmSync(historyDest, { recursive: true, force: true }); // Remove existing history folder
    fs.cpSync(historySrc, historyDest, { recursive: true });
    console.log('History folder copied to allure-results.');
} else {
    console.log('No history folder found in allure-report.');
}

// Copy categories.json if it exists
if (fs.existsSync(categoriesSrc)) {
    fs.copyFileSync(categoriesSrc, categoriesDest);
    console.log('categories.json copied to allure-results.');
} else {
    console.log('No categories.json found in report-utils.');
}

console.log(`File created at: ${filePath}`);