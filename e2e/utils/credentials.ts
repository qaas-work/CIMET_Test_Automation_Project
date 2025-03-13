import fs from 'fs';
import dotenv from 'dotenv';

const ENV_FILE = '.env';

// Load existing environment variables
dotenv.config();

export function saveCredentials(username: string, password: string) {
    const envContent = `USERNAME=${username}\nPASSWORD=${password}\n`;
    fs.writeFileSync(ENV_FILE, envContent);
}

export function getCredentials(): { username: string; password: string } {
    if (!process.env.USERNAME || !process.env.PASSWORD) {
        throw new Error('No credentials found! Run the register test first.');
    }
    return { username: process.env.USERNAME, password: process.env.PASSWORD };
}
