import { AppDataSource } from "./data-source";
import express from "express";

import * as AdminJSTypeorm from "@adminjs/typeorm";
import * as userController from "./controllers/userController";
import * as categoryController from "./controllers/categoryController";
import * as taskController from "./controllers/taskController";
import { User } from "./entity/User";
import { Task } from "./entity/Task";
import { Category } from "./entity/Category";
import path from "path";
// import * as url from 'url'
// import path from "path";
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const port = 3000;

const start = async () => {
  try {
    const [adminjsModule, adminjsexpressModule, uploadFeatureModule] = await Promise.all([
      import("adminjs"),
      import("@adminjs/express"),
      import("@adminjs/upload")
    ]);

    const AdminJS = adminjsModule.default;
    const AdminJSExpress = adminjsexpressModule.default;
    const uploadFeature = uploadFeatureModule.default;


    const localProvider = {
      bucket: 'public/uploads',
      opts: {
        baseUrl: '/uploads',
      },
    };

    AdminJS.registerAdapter({
      Resource: AdminJSTypeorm.Resource,
      Database: AdminJSTypeorm.Database,
    });

    await AppDataSource.initialize();
    const adminOptions = {
      resources: [
        {
          resource: User,
          options: {
            properties: {
              profilePhoto: {
                type: "uploadFile",
                isVisible: { edit: true, show: true },
                mimeType: "image/jpeg,image/png",
              },
            },
          },
          features: [
            uploadFeature({
              properties: {
                key: 'profilePhoto', // to this db field feature will safe S3 key
                mimeType: 'mimeType' // this property is important because allows to have previews
                },
              provider: { local: localProvider },
              validation: { mimeTypes: ['image/png', 'application/pdf', 'audio/mpeg'] },
            }),
          ],
        },
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

    app.use(express.static(path.join(__dirname, '../public')));
    console.log("path : ", path.join(__dirname, '../public'))

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
