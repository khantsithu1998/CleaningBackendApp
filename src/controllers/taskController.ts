import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { Between } from "typeorm";

export const getTasks = async (req: Request, res: Response) => {
  const { page = '1', perPage = '10', startDate, endDate } = req.query; // Ensure page and perPage are strings
  const skip = (parseInt(page.toString()) - 1) * parseInt(perPage.toString());

  try {
    let queryOptions: any = {
      skip,
      take: parseInt(perPage.toString()),
      relations: ["category", "user"],
    };

    if (startDate && endDate) {
      const startDateTime = new Date(startDate.toString());
      const endDateTime = new Date(endDate.toString());
      endDateTime.setDate(endDateTime.getDate() + 1); // Adjust end date to include the whole day

      queryOptions.where = {
        schedule_time: Between(startDateTime, endDateTime),
      };
    }

    const [tasks, total] = await AppDataSource.manager.findAndCount(Task, queryOptions);

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
  const { page = '1', perPage = '10', startDate, endDate } = req.query;
  const skip = (parseInt(page.toString()) - 1) * parseInt(perPage.toString());

  try {
    let queryOptions: any = {
      where: {
        is_completed: true,
      },
      skip,
      take: parseInt(perPage.toString()),
      relations: ["category", "user"],
    };

    if (startDate && endDate) {
      const startDateTime = new Date(startDate.toString());
      const endDateTime = new Date(endDate.toString());
      endDateTime.setDate(endDateTime.getDate() + 1); // Adjust end date to include the whole day

      queryOptions.where.completedAt = Between(startDateTime, endDateTime);
    }

    const [tasks, total] = await AppDataSource.manager.findAndCount(Task, queryOptions);

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
        isCompleted: true,
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
        isCompleted: true,
        completedAt: Between(startDate, endDate),
      },
      relations: ["category", "user"],
    });

    // Calculate the total duration in hours for the tasks in the week
    let totalDurationInHours = 0;
    for (const task of tasks) {
      const startTime = task.startTime.getTime();
      const endTime = task.endTime.getTime();
      const durationInMilliseconds = endTime - startTime;
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


export const completeTask = async (req: Request, res: Response) => {
  const { task_id } = req.body;

  try {
    const taskRepository = AppDataSource.manager.getRepository(Task);
    const task = await taskRepository.findOneBy({ id: task_id });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (task.isCompleted) {
      return res.status(400).json({ error: "Task is already completed." });
    }

    // Mark the task as completed and set the completion time to the current date and time
    task.isCompleted = true;
    task.completedAt = new Date();
    await taskRepository.save(task);

    res.status(200).json({ message: "Task completed successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to complete the task." });
  }
};


export const createTask = async (req: Request, res: Response) => {
  const { user_id, category_id, location, instructions, start_time, end_time } =
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
    task.startTime = start_time;
    task.endTime = end_time;
    task.isCompleted = false;
    task.completedAt = null;
    const createdTask = await AppDataSource.manager.save(task);

    res.status(201).json(createdTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create the task." });
  }
};
