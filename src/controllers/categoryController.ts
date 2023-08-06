import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";


export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await AppDataSource.manager.find(Category);
    res.status(200).json({ data: categories });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const category = new Category();
    category.name = name;
    const createdCategory = await AppDataSource.manager.save(category);

    res.status(201).json(createdCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create the category." });
  }
};

