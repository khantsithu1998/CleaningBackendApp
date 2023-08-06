// src/entity/Task.ts

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity({ name : "tasks"})
export class Task extends BaseEntity {
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

  @Column({ default: "" })
  photo: string;

  @Column("json", { nullable: true })
  instructions: { instruction_title: string; instruction_photo: string }[];

  @Column({ default: false })
  is_completed: boolean;

  @Column({ nullable: true, type: "datetime" }) // Make the completedAt field nullable and of type datetime
  completedAt : Date;

  @Column({ type: "datetime", nullable: false , default: () => 'CURRENT_TIMESTAMP' })
  start_time: Date;

  @Column({ type: "datetime", nullable: false , default: () => 'CURRENT_TIMESTAMP' })
  end_time: Date;
}
