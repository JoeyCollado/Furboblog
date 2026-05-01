"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
// Import the Id type from your generated data model
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath, updateTag } from "next/cache";

export async function createBlogAction(
  values: z.infer<typeof postSchema>
): Promise<{ error: string } | void> {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      return { error: "Invalid form data." };
    }

    const token = await getToken();
    if (!token) return { error: "Unauthorized" };

    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return { error: "Failed to upload image" };
    }

    const { storageId } = await uploadResult.json();

    // The Fix: Cast the string from the JSON response to the branded Id type
    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId as Id<"_storage">, // Explicit casting here
      },
      { token }
    );

    
  } catch (err) {
    console.error(err);
    revalidatePath('/blog')
    return { error: "Failed to create post" };
  }

  updateTag("blog");
  redirect("/blog");
}