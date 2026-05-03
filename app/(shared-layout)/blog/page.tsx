// app/(shared-layout)/blog/page.tsx

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

// FIX: Force dynamic rendering to prevent the build from failing 
// when it tries to fetch Convex data without a live connection.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Blog",
  description: 'Read new blogs',
  category: 'Web development',
  authors: [{name: 'Joey'}],
}

const BlogPage = () => {
  return (
    <div>
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Where Insights, Thoughts, and Trends rest
        </p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi/>}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
};

export default BlogPage;

async function LoadBlogList() {

  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl ?? "https://images.unsplash.com/photo-1773176647951-d8f618dee942?q=80&w=870&auto=format&fit=crop"}
              fill
              alt="blog image"
              className="rounded-t-lg object-cover"
            />
          </div>

          <CardContent>
            {/* FIXED: Added the missing "/" to ensure the link path is valid */}
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>

          <CardFooter>
            <Link
              className={buttonVariants({
                className: "w-full",
              })}
              href={`/blog/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi(){
  return(
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
    {[...Array(3)].map((_, i) => (
    <div className="flex flex-col space-y-3" key={i}>
      <Skeleton className="h-48 w-full rounded-xl"/>  
        <div className="space-y-2 flex flex-col">
          <Skeleton className="h-6 w-3/4"/>
          <Skeleton className="h-4 w-full"/> 
          <Skeleton className="h-4 w-2/3"/>
        </div>
    </div>))}
  </div>
  )
}