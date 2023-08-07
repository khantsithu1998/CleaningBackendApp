import { AppDataSource } from "./data-source";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import * as userController from "./controllers/userController";
import * as categoryController from "./controllers/categoryController";
import * as taskController from "./controllers/taskController";
import { User } from "./entity/User";
import { Task } from "./entity/Task";
import { Category } from "./entity/Category";

const port = 3000;

const start = async () => {
  try {
    const [adminjsModule, adminjsexpressModule] = await Promise.all([
      import("adminjs"),
      import("@adminjs/express"),
    ]);

    const AdminJS = adminjsModule.default;
    const AdminJSExpress = adminjsexpressModule.default;

    AdminJS.registerAdapter({
      Resource: AdminJSTypeorm.Resource,
      Database: AdminJSTypeorm.Database,
    });

    await AppDataSource.initialize();
    const adminOptions = {
      resources: [
        { resource: User , options : {
          properties : {
            
          }
        }},
        {
          resource: Task,
          options: {
            properties: {},
          },
        },
        Category,
      ],
    };
    const app = express();
    app.use(express.json());
    // User routes
    app.get("/users", userController.getUsers);

    // Category routes
    app.get("/categories", categoryController.getCategories);
    app.post("/categories", categoryController.createCategory);

    // Task routes
    app.get("/tasks", taskController.getTasks);
    app.post("/tasks/create", taskController.createTask);
    app.post("/tasks/complete", taskController.completeTask);

    // Completed Tasks Route
    app.get("/completed-tasks", taskController.getCompletedTasks);

    app.post(
      "/task-completed-per-week",
      taskController.getTaskCompletedPerWeek,
    );
    app.post("/duration-per-week", taskController.getTaskDurationPerWeek);

    const admin = new AdminJS(adminOptions);

    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
