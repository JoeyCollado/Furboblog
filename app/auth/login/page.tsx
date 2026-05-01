"use client";
import { loginSchema } from "@/app/schemas/auth";
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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const LoginPage = () => { 
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({
    //setting up react hook form
    resolver: zodResolver(loginSchema), //this will validate our data against the zod schema
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>){

    startTransition( async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully")
            router.push("/") //redirect users to index page after toast success notification
          },
          onError: (error) => {
            toast.error(error.error.message)
          }}
      })
    })

  
  }

  return (
    <div>
      <Card>
        {" "}
        {/* container */}
        <CardHeader>
          {" "}
          {/* header */}
          <CardTitle>
            {" "}
            {/* title */}
            Login
          </CardTitle>
          <CardDescription>
            {" "}
            {/* description */}
            Login to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          {/* content */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
            
              {/* email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input placeholder="john@doe.com" type="email" {...field} />
                    {fieldState.invalid && ( //if there's an error render
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      placeholder="johnDoePassword"
                      type="password"
                      {...field}
                    />
                    {fieldState.invalid && ( //if there's an error render
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isPending}>{isPending ? (
                <>
                <Loader2 className="size-4 animate-spin"/>
                <span>Loading...</span>
                </>
              ): (
                <span>Login</span>
              )}</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
