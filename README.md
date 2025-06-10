# Backend_to_do_API
Project Report: Task Management API
Objective
      The goal of this project is to build a secure, RESTful API using Node.js and Express that allows users to manage a list of tasks. The system supports task creation, retrieval, updating, deletion, and searching, all behind JWT-based authentication.
Architecture & Design Approach
1.	Backend Stack:
o	Node.js for runtime
o	Express.js for routing and middleware
o	UUID for generating unique task IDs
o	Morgan for request logging
o	JSON Web Tokens (JWT) for authentication and route protection
2.	Data Handling:
o	Data is stored in-memory as an array of task objects, each with a unique id, title, and description.
3.	RESTful Principles:
o	Each route corresponds to a standard HTTP verb (GET, POST, PUT, DELETE).
o	Resources (/tasks) are accessed and manipulated via predictable URLs.

Security & Authentication
•	A /login route simulates user login by issuing a JWT token.
•	All /tasks routes are protected by a middleware (authenticateToken) which validates the JWT.
•	Tokens are passed via the Authorization header in the format Bearer <token>.

 Middleware Strategy
•	authenticateToken: Ensures the request is coming from an authenticated user.
•	validateTask: Confirms that both title and description fields are present in requests modifying tasks.

 Core Features 
1.	Create Task:
o	Validates input, generates a UUID, adds the task to memory.
2.	Get All Tasks:
o	Supports pagination (page, limit), filtering (search), and sorting (sortBy, order).
o	Implements case-insensitive search and flexible field-based sorting.
3.	Get Task by ID:
o	Finds a task matching the id in the URL; returns 404 if not found.
4.	Update Task:
o	Checks for existence, then merges existing task with new data.
5.	Delete Task:
o	Locates the task by ID and removes it from the array.
How to Run:
1. Install dependencies:
   npm install
2. Start the server:
   node app.js
3. Use Postman or curl to test the API.
   - First, POST to /login with a JSON body:
     {
       "username": "your-name"
     }
   - Use the returned token in the Authorization header for all /tasks requests.

API Endpoints:
1.	JWT Authentication- login
 
 

2.	Get - http://localhost:3000/tasks
 
3.	Post - http://localhost:3000/tasks
 

4.	Get by id – 
http://localhost:3000/tasks/5440de64-6ec2-483e-b066-8006f8051b5d
 
5.	PUT /tasks/:id
http://localhost:3000/tasks/5440de64-6ec2-483e-b066-8006f8051b5d
 

6.	DELETE /tasks/:id
http://localhost:3000/tasks/9501dd09-a472-49a2-8a86-8738530e60a8
 


7.	Get All Tasks (with pagination, filtering) 

