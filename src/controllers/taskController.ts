import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { Between } from "typeorm";

export const getTasks = async (req: Request, res: Response) => {
  const { page = '1', perPage = '10' } = req.query; // Ensure page and perPage are strings
  const skip = (parseInt(page.toString()) - 1) * parseInt(perPage.toString());

  try {
    const [tasks, total] = await AppDataSource.manager.findAndCount(Task, {
      skip,
      take: parseInt(perPage.toString()),
      relations: ["category", "user"],
    });

    res.status(200).json({
      data: tasks,
      total,
      currentPage: parseInt(page.toString()),
      totalPages: Math.ceil(total / parseInt(perPage.toString())),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
};


export const getCompletedTasks = async (req: Request, res: Response) => {
  const { page = '1', perPage = '10' } = req.query;
  const skip = (parseInt(page.toString()) - 1) * parseInt(perPage.toString());

  try {
    const [tasks, total] = await AppDataSource.manager.findAndCount(Task, {
      where: {
        is_completed: true,
      },
      skip,
      take: parseInt(perPage.toString()),
      relations: ["category", "user"],
    });

    res.status(200).json({
      data: tasks,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / parseInt(perPage.toString())),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch completed tasks." });
  }
};

export const getTaskCompletedPerWeek = async (req: Request, res: Response) => {
  const { weekStartDate } = req.body;

  try {
    // Calculate the start and end dates of the week
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Find all completed tasks within the specified week
    const tasks = await AppDataSource.manager.find(Task, {
      where: {
        is_completed: true,
        completedAt: Between(startDate, endDate),
      },
      relations: ["category", "user"],
    });

    res.status(200).json({
      completedTasksCount: tasks.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch completed tasks per week." });
  }
};


export const getTaskDurationPerWeek = async (req: Request, res: Response) => {
  const { weekStartDate } = req.body;

  try {
    // Calculate the start and end dates of the week
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Find all completed tasks within the specified week
    const tasks = await AppDataSource.manager.find(Task, {
      where: {
        is_completed: true,
        completedAt: Between(startDate, endDate),
      },
      relations: ["category", "user"],
    });

    // Calculate the total duration in hours for the tasks in the week
    let totalDurationInHours = 0;
    for (const task of tasks) {
      const durationInMilliseconds = task.completedAt.getTime() -
        task.schedule_time.getTime();
      totalDurationInHours += durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
    }

    res.status(200).json({
      totalDurationInHours,
      tasksCount: tasks.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch task duration per week." });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { user_id, category_id, location, instructions, schedule_time } =
    req.body;

  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const userFound = await userRepository.findOneBy({ id: user_id });

    const categoryRepository = AppDataSource.manager.getRepository(Category);
    const categoryFound = await categoryRepository.findOneBy({
      id: category_id,
    });

    const task = new Task();
    task.user = userFound;
    task.category = categoryFound;
    task.location = location;
    task.instructions = instructions;
    task.schedule_time = schedule_time;
    task.is_completed = false;
    task.completedAt = null;
    const createdTask = await AppDataSource.manager.save(task);

    res.status(201).json(createdTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create the task." });
  }
};
