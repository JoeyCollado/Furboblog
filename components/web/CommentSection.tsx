"use client";
import React, { useTransition } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const CommentSection = (props: {preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;}) => {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments)
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment posted successfully");
      } catch {
        toast.error("Failed to create post");
      }
    })
  }

  if(data === undefined){ //if data is undefined render this
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          <MessageSquare className="size-5" />
          <h2 className="text-xl font-bold">{data.length} Comments</h2>
        </CardHeader>

        <CardContent className="space-y-8">
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input placeholder="Comment your thoughts" {...field} />
                  {fieldState.invalid && ( //if there's an error render
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Comments</span>
              )}
            </Button>
          </form>

          {data?.length > 0 && <Separator/>} {/* if data length is greater than 0 render separator */}

          <section className="space-y-6">
            {data?.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <Avatar className="size-10 shrink-0">
                <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}`} alt={comment.authorName}/>
                <AvatarFallback>
                  {comment.authorName.slice(0,2).toUpperCase()}
                  </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{comment.authorName}</p>
                      <p className="text-muted-foreground text-xs">{new Date(comment._creationTime).toLocaleDateString("en-US")}</p>
                    </div>

                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                  </div>
              </div>
            ))}

          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentSection;
