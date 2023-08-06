import { AppDataSource } from "./data-source";
import express from "express";
import * as userController from "./controllers/userController";
import * as categoryController from "./controllers/categoryController";
import * as taskController from "./controllers/taskController";

const app = express();
const port = 3000;

app.use(express.json());

const start = async () => {
  try {
    await AppDataSource.initialize();
    // User routes
    app.get("/users", userController.getUsers);

    // Category routes
    app.get("/categories", categoryController.getCategories);
    app.post("/categories", categoryController.createCategory);

    // Task routes
    app.get("/tasks", taskController.getTasks);
    app.post("/tasks", taskController.createTask);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
