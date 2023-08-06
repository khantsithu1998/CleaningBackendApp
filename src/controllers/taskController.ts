import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const getTasks = async (req: Request, res: Response) => {
  const { page = 1, perPage = 10 } = req.body;
  const skip = (parseInt(page) - 1) * parseInt(perPage);

  try {
    const [tasks, total] = await AppDataSource.manager.findAndCount(Task, {
      skip,
      take: parseInt(perPage),
      relations: ["category", "user"],
    });

    res.status(200).json({
      data: tasks,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(perPage)),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
};

export const createTask = async  (req: Request, res: Response) => {
  const { user_id, category_id, location, instructions, schedule_time } =
    req.body;

  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const userFound = await userRepository.findOneBy({ id: user_id });

    const categoryRepository = AppDataSource.manager.getRepository(Category);
    const categoryFound = await categoryRepository.findOneBy({ id: category_id });

    const task = new Task();
    task.user = userFound;
    task.category = categoryFound;
    task.location = location;
    task.instructions = instructions;
    task.schedule_time = schedule_time;
    task.is_completed = false;
    task.completedAt = null
    const createdTask = await AppDataSource.manager.save(task);

    res.status(201).json(createdTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create the task." });
  }
};
