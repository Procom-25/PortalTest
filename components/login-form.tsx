"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDestructive } from "@/components/Alert";
import { authenticateCompany } from "@/lib/auth"

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({

  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call authenticateCompany to check credentials
    const authenticated = await authenticateCompany(email, password);
    
    if (authenticated) {
        // Redirect to dashboard if authenticated
        router.push(`/dashboard?name=${encodeURIComponent(email)}`);
    } else {
        // Show error message if authentication fails
        setError("Invalid email or password");
    }
};


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Company Name</Label>
          <Input id="name" type="name" placeholder="Fast ltd" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />

        </div>
        {error && <AlertDestructive message={error} />}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  )
}
