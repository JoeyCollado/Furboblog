"use client";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  //components need no default keyword as this is not a full on routes and only a component
  return (
    <nav className="flex items-center w-full py-5 justify-between">
      {" "}
      {/* navbar container */}
      {/* Logo */}
      <div className="flex items-center gap-8">
        {" "}
        {/* left */}
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Furbo<span className="text-primary">Blog</span>
          </h1>
        </Link>
        {/* Links */}
        <div className="flex items-center gap-2">
          {" "}
          {/* right */}
          <Link className={buttonVariants({ variant: "ghost" })} href="/home">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>
      {/* Button */}
      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput/>
        </div>
        {isLoading ? null : isAuthenticated ? (
          <Button onClick={() => authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast.success("Logged out successfully")
                router.push("/") //redirect users to index page after toast success notification
              },
              onError: (error) => {
                toast.error(error.error.message)
              }
            }
          })}>Logout</Button>
        ) : (
          <>
            {" "}
            {/* further right */}
            <Link className={buttonVariants()} href="/auth/sign-up">
              Sign up
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/auth/login"
            >
              Login
            </Link>
            {/* Theme Toggle */}
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
