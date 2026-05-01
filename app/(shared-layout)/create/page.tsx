"use client";
import { createBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { title } from "process";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CreateRoute = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    //setting up react hook form
    resolver: zodResolver(postSchema), //this will validate our data against the zod schema
    defaultValues: {
      content: "",
      title: "",
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
     console.log("this runs on client side")
    await createBlogAction(values);
    });
  }
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        {" "}
        {/* header wrapper */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Start sharing your thoughts
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input placeholder="Blog Title" {...field} />
                    {fieldState.invalid && ( //if there's an error render
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea placeholder="Blog Content" {...field} />
                    {fieldState.invalid && ( //if there's an error render
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input aria-invalid={fieldState.invalid}
                           placeholder="Blog Content" 
                           type="file" 
                           accept="image/*" 
                           onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file);
                    }}/>
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
                <span>Create Post</span>
              )}
            </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoute;
