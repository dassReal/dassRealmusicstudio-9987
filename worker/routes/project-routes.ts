import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { projects } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const projectSchema = z.object({
  type: z.enum(["video", "song", "album-cover"]),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  data: z.string(),
  thumbnail: z.string().optional(),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  data: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const projectRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.updatedAt));
    
    return c.json({ projects: userProjects });
  })
  
  .get("/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const projectId = c.req.param("id");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();
    
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    if (project.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    return c.json({ project });
  })
  
  .post("/", zValidator("json", projectSchema), async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const data = c.req.valid("json");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const projectId = crypto.randomUUID();
    const now = new Date();
    
    const newProject = {
      id: projectId,
      userId: user.id,
      type: data.type,
      title: data.title,
      description: data.description || null,
      data: data.data,
      thumbnail: data.thumbnail || null,
      createdAt: now,
      updatedAt: now,
    };
    
    await db.insert(projects).values(newProject);
    
    return c.json({ project: newProject }, 201);
  })
  
  .patch("/:id", zValidator("json", updateProjectSchema), async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const projectId = c.req.param("id");
    const data = c.req.valid("json");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();
    
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    if (project.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    const updatedData: any = {
      updatedAt: new Date(),
    };
    
    if (data.title) updatedData.title = data.title;
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.data) updatedData.data = data.data;
    if (data.thumbnail !== undefined) updatedData.thumbnail = data.thumbnail;
    
    await db
      .update(projects)
      .set(updatedData)
      .where(eq(projects.id, projectId));
    
    const updated = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();
    
    return c.json({ project: updated });
  })
  
  .delete("/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const projectId = c.req.param("id");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();
    
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    if (project.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    await db.delete(projects).where(eq(projects.id, projectId));
    
    return c.json({ success: true });
  });
