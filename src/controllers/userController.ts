// controllers/userController.js

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.manager.find(User);
    res.status(200).json({ data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};


