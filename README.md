# back-task-manager
This document provides a comprehensive overview of the task-manager repository, a Firebase Cloud Functions-based task management system implementing clean architecture principles. The system provides REST API endpoints for managing tasks and users with JWT-based authentication, all deployed as serverless functions on Google Firebase.

## Overview
### Project Description
This is a backend project for a task manager. It's built with **Node.js** and **TypeScript**, using **Firebase Functions** for deployment. The project uses **Express.js** to handle API routes, **Firebase Admin** to interact with Firebase services, and **CORS** to handle cross-origin policies.
### Requirements
For the project to work properly, you need to have installed:

 - Node.js (version 20 or higher)
 - Firebase CLI

### Installation
-   **Clone this repository:** `git clone https://github.com/oleafarx/back-task-manager.git`
    
-   **Navigate to the project directory::** `cd back-task-manager/functions`
    
-   **Install project dependencies:** `npm install`
### Uses
To start the project locally and work with Firebase functions, use the following command. Remember to have Firebase installed on your computer before running this command.

`npm run serve`

This command will compile your TypeScript code to JavaScript and launch the Firebase emulators for your functions.

#### Additional Commands

-   **Compile the code:** `npm run build`
    
-   **Run the tests:** `npm run test`
    
-   **Run tests with coverage:** `npm run test:coverage`
   
## Architecture
### Architectural Layers
| Layer         | Responsibility                                      | Key Components                                |
|---------------|------------------------------------------------------|-----------------------------------------------|
| Interface     | HTTP handling, routing, request/response formatting  | Express routes, controllers, middleware       |
| Application   | Business logic orchestration, use case coordination | Use case classes                              |
| Domain        | Core business rules, entities, repository contracts | Entities, interfaces                          |
| Infrastructure| External integrations, data persistence             | Repository implementations, Firebase services |

### Core Domain Entities
#### Task Entity
The  `Task`  entity represents the central business object of the system, encapsulating all task-related data and business rules. It follows an interface-implementation pattern with  `ITask`  defining the contract and  `Task`  providing the concrete implementation.
| Property     | Type     | Description                     | Mutability |
|--------------|----------|---------------------------------|------------|
| id           | string?  | Unique identifier               | readonly   |
| userId       | string   | Owner reference                 | readonly   |
| title        | string   | Task title                      | mutable    |
| description  | string   | Task details                    | mutable    |
| isCompleted  | boolean  | Completion status               | mutable    |
| createdAt    | Date     | Creation timestamp              | readonly   |
| updatedAt    | Date     | Last modification timestamp     | mutable    |
| isActive     | boolean  | Soft delete flag                | mutable    |

The `Task` class constructor provides sensible defaults for optional fields, with `description` defaulting to empty string, `isCompleted` to `false`, timestamps to current date, and `isActive` to `true`.

#### User Entity
The `User` entity represents system users with minimal required information, following a lightweight design focused on essential identification data.
| Property   | Type    | Description                   | Mutability |
|------------|---------|-------------------------------|------------|
| id         | string? | Unique identifier             | readonly   |
| email      | string  | User email address            | mutable    |
| createdAt  | Date    | Account creation timestamp    | readonly   |

The `User` class constructor defaults `createdAt` to the current date when not provided

#### Token Entity
The token-related entities define the structure for JWT authentication tokens used throughout the system. These consist of two interfaces: `TokenPayload` for the token contents and `TokenPair` for token distribution.

***Token Payload Structure:***
| Property | Type     | Description            |
|----------|----------|------------------------|
| userId   | string   | User identifier        |
| email    | string   | User email             |
| iat      | number?  | Issued at timestamp    |
| exp      | number?  | Expiration timestamp   |

***TokenPair Structure:***
| Property     | Type   | Description                 |
|--------------|--------|-----------------------------|
| accessToken  | string | Short-lived access token    |
| refreshToken | string | Long-lived refresh token    |

#### Entity Relationships
<img width="486" height="403" alt="image" src="https://github.com/user-attachments/assets/f3d7fa15-d08e-4a02-9733-4c5913009b1f" />

### Request Processing Flow
Requests flow through the system following clean architecture principles, with each layer handling specific concerns:
<img width="1047" height="554" alt="image" src="https://github.com/user-attachments/assets/74d255c5-34c3-4a6d-864b-3a5010082d60" />


