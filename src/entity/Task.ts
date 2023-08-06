// src/entity/Task.ts

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Category, { eager: true, nullable: false })
  @JoinColumn()
  category: Category;

  @Column()
  location: string;

  @Column({ default: "" })
  description: string;

  @Column("text", { array: true, nullable: true })
  photo: string[];

  @Column("json", { nullable: false })
  instructions: { instruction_title: string; instruction_photo: string }[];

  @Column({ default: false })
  is_completed: boolean;

  @Column({ nullable: true, type: "datetime" }) // Make the completedAt field nullable and of type datetime
  completedAt : Date;

  @Column({ type: "datetime", nullable: false , default: () => 'CURRENT_TIMESTAMP' })
  schedule_time: Date;
}
