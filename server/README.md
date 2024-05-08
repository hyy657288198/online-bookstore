# lab-assignment-4-group_2
lab-assignment-4-group_2 created by GitHub Classroom

# Clone the project
```bash
git clone [https://github.com/WebAppDev2023-Western/lab-assignment-4-group_2/]
```
# Navigate to the project directory
```bash
cd lab-assignment-4-group_2
```
# Install dependencies
```bash
npm install axios@1.6.2 bcrypt@5.1.1 cors@2.8.5 express@4.18.2 pg@8.11.3
```
# Run the project
```bash
node server.js
```
# API Documentation
Go to the Google Cloud Console.
Create a new project or select an existing one.
Enable the "Google Books API" for your project.
Create API credentials (API key) and restrict it as needed. 

# Database Connection Guide
For the local database: 
Download the webdatabase.sql file in server branch. 
```bash
cd ./database/db.js
```
Change the host and password below
```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'webdatabase',
  password: 'your_password',
  port: 5432,
});
```


# Authors
Josie
