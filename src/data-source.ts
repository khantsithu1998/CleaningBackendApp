import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Task } from "./entity/Task"
import { Category } from "./entity/Category"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root123",
    database: "cleaning_app_db",
    synchronize: true,
    logging: false,
    entities: [User, Task, Category],
    migrations: [User,Task,Category],
    subscribers: [],
})
