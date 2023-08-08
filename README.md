# Project Build With CleaningBackendApp

Installation and Testing Instructions
Clone the Repository:

Open your terminal.
Navigate to the directory where you want to clone the repository.
Run the following command to clone the repository:
bash
Copy code
git clone <repository_url>
Replace <repository_url> with the actual URL of the GitHub repository.
Install Dependencies:

Change into the cloned repository's directory:
bash
Copy code
cd <repository_directory>
Install the required Node.js dependencies using npm:
Copy code
npm install
Configure Database:

Open the data-source.ts file in the src directory.
Configure your database connection details in the AppDataSource class.
Run the Application:

After configuring the database, return to the terminal.
Run the following command to start the application:
sql
Copy code
npm start
Access Admin Dashboard:

Open your web browser.
Navigate to http://localhost:3000/admin.
You should see the Admin Dashboard interface.
Test API Endpoints:

Open a tool for making API requests (e.g., Postman, Insomnia, cURL, etc.).
Test the provided API endpoints by sending requests to the following URLs:
GET Users: http://localhost:3000/users
GET Categories: http://localhost:3000/categories
POST Create Category: http://localhost:3000/categories
GET Tasks: http://localhost:3000/tasks
POST Create Task: http://localhost:3000/tasks/create
POST Complete Task: http://localhost:3000/tasks/complete
GET Completed Tasks: http://localhost:3000/completed-tasks
POST Task Completed Per Week: http://localhost:3000/task-completed-per-week
POST Task Duration Per Week: http://localhost:3000/duration-per-week
API Testing Tips:

Use appropriate HTTP methods (GET, POST, etc.) for each endpoint.
For POST endpoints, provide the required data in the request body (e.g., JSON format).
Refer to the provided controllers and entity classes for details about data structures and required fields.
Remember to handle any errors or issues that may arise during the installation and testing process. If you encounter any challenges or need further assistance, feel free to ask for help.

Please note that the provided code assumes certain configurations and dependencies, so ensure that you have the necessary prerequisites installed and properly configured before starting the application.
