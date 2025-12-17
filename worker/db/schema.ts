import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  data: text("data").notNull(),
  thumbnail: text("thumbnail"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  mediaUrl: text("media_url"),
  likes: integer("likes").default(0).notNull(),
  plays: integer("plays").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  postId: text("post_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
