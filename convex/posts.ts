import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

// Create a new post with the given body and title
export const createPost = mutation({
  args: { title: v.string(), body: v.string(), imageStorageId: v.id("_storage")}, //get title and body from client side with the typoe of string
  handler: async (ctx, args) => { //get business logic
    //only authenticated users can create blogs
    const user = await authComponent.safeGetAuthUser(ctx);

    if(!user){
        throw new ConvexError("Not Authenticated");
    }
     
    const blogArticle = await ctx.db.insert("posts", {
        body: args.body,
        title: args.title,
        authorId: user._id,
        imageStorageId: args.imageStorageId
    })

    return blogArticle;
  },
});

//fetch query server action
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').order("desc").collect(); //post

    return await Promise.all( //fetch data
      posts.map(async(post) => {
        const resolvedImageUrl = post.imageStorageId !== undefined
        ? await ctx.storage.getUrl(post.imageStorageId) 
        : null;

        return { //return data
          ...post,
          imageUrl: resolvedImageUrl,
        }
      })
    )
  }
})

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if(!user){ //check if user is authenticated
      throw new ConvexError("Not Authenticated");
  }

  //upload image generate
  return await ctx.storage.generateUploadUrl();
  }
})

//server function to render image with blog dynamic routes
export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx,args) => {
    const post = await ctx.db.get(args.postId);

    if(!post){
      return null;
    }

    //generate image url
    const resolvedImageUrl = post?.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;

    //return data
    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
})

interface searchResultTypes{
  _id: string;
  title: string;
  body: string;   
}

export const searchPosts = query({
  args : {
    term: v.string(),
    limit: v.number(),
  },
    handler: async (ctx, args) => {
      const limit = args.limit  

      const results: Array<searchResultTypes> = [];

      const seen = new Set(); 

      const pushDocs = async (docs: Array<Doc<'posts'>>) => {
         for (const doc of docs){
          if(seen.has(doc._id)) continue

          seen.add(doc._id);
          results.push({
            _id: doc._id,
            title: doc.title,
            body: doc.body
          });
          if(results.length >= limit) break;
         }
      };

      const titleMatches = await ctx.db.query('posts').withSearchIndex('search_title', (q) => q.search('title', args.term)).take(limit)
      
      await pushDocs(titleMatches);

      if(results.length < limit){
        const bodyMatches =  await ctx.db.query('posts').withSearchIndex('search_body', (q) => q.search('body', args.term)).take(limit)
      
        await pushDocs(bodyMatches);
      }

      return results;
    }
});