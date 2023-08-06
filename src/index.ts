import { AppDataSource } from "./data-source";
import express, { Request, Response } from "express";
import { User } from "./entity/User";
import { Task } from "./entity/Task";
import { Category } from "./entity/Category";

const app = express();
const port = 3000;

app.use(express.json());

const start = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.manager.clear(Task);
    app.get("/users", async (req: Request, res: Response) => {
      const users = await AppDataSource.manager.find(User);
      res.json({ data: users });
    });

    app.get("/categories", async (req: Request, res: Response) => {
      const categories = await AppDataSource.manager.find(Category);
      res.json({ data: categories });
    });

    app.post("/categories", async (req: Request, res: Response) => {
      const { name } = req.body;

      try {
        const category = new Category();
        category.name = name;
        const createdCategory = await AppDataSource.manager.save(category);

        res.status(201).json(createdCategory);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create the task." });
      }
    });

    app.get("/tasks", async (req: Request, res: Response) => {
      const { page = 1, perPage = 10 } = req.query; // Use default values 1 and 10 if not provided
      const skip = (parseInt(page as string) - 1) * parseInt(perPage as string);

      try {
        const [tasks, total] = await AppDataSource.manager.findAndCount(Task, {
          skip,
          take: parseInt(perPage as string),
          relations: ["category", "user"], // Include any additional relations you want to fetch with the task
        });

        res.json({
          data: tasks,
          total,
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(perPage as string)),
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch tasks." });
      }
    });

    app.post("/tasks", async (req: Request, res: Response) => {
      const { user_id, category_id, location, instructions, schedule_time } =
        req.body;

      try {
        const userRepository = AppDataSource.manager.getRepository(User);
        const userFound = await userRepository.findOneBy({ id: user_id });

        const categoryRepository = AppDataSource.manager.getRepository(
          Category,
        );
        const categoryFound = await categoryRepository.findOneBy({
          id: category_id,
        });

        const task = new Task();
        task.user = userFound;
        task.category = categoryFound;
        task.location = location;
        task.instructions = instructions;
        task.schedule_time = schedule_time;
        const createdTask = await AppDataSource.manager.save(task);

        res.status(201).json(createdTask);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create the task." });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
