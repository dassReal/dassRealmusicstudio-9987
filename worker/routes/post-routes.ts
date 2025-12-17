import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { posts, likes, projects } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";

const postSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  thumbnail: z.string().optional(),
  mediaUrl: z.string().optional(),
});

export const postRoutes = new Hono<HonoContext>()
  .get("/", async (c) => {
    const db = c.get("db");
    
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
    
    return c.json({ posts: allPosts });
  })
  
  .get("/:id", async (c) => {
    const db = c.get("db");
    const postId = c.req.param("id");
    
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .get();
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    await db
      .update(posts)
      .set({ plays: post.plays + 1 })
      .where(eq(posts.id, postId));
    
    return c.json({ post: { ...post, plays: post.plays + 1 } });
  })
  
  .use("*", authenticatedOnly)
  
  .post("/", zValidator("json", postSchema), async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const data = c.req.valid("json");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, data.projectId))
      .get();
    
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    if (project.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    const postId = crypto.randomUUID();
    
    const newPost = {
      id: postId,
      userId: user.id,
      projectId: data.projectId,
      title: data.title,
      description: data.description || null,
      thumbnail: data.thumbnail || null,
      mediaUrl: data.mediaUrl || null,
      likes: 0,
      plays: 0,
      createdAt: new Date(),
    };
    
    await db.insert(posts).values(newPost);
    
    return c.json({ post: newPost }, 201);
  })
  
  .post("/:id/like", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const postId = c.req.param("id");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .get();
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)))
      .get();
    
    if (existingLike) {
      await db
        .delete(likes)
        .where(eq(likes.id, existingLike.id));
      
      await db
        .update(posts)
        .set({ likes: Math.max(0, post.likes - 1) })
        .where(eq(posts.id, postId));
      
      return c.json({ liked: false, likes: Math.max(0, post.likes - 1) });
    } else {
      const likeId = crypto.randomUUID();
      
      await db.insert(likes).values({
        id: likeId,
        userId: user.id,
        postId,
        createdAt: new Date(),
      });
      
      await db
        .update(posts)
        .set({ likes: post.likes + 1 })
        .where(eq(posts.id, postId));
      
      return c.json({ liked: true, likes: post.likes + 1 });
    }
  })
  
  .delete("/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const postId = c.req.param("id");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .get();
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    if (post.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    
    await db.delete(likes).where(eq(likes.postId, postId));
    await db.delete(posts).where(eq(posts.id, postId));
    
    return c.json({ success: true });
  });
