"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { QA_PROFILE } from "@/lib/mesa/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SESSION = "mesa-session";

export default function MesaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(QA_PROFILE.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (email === QA_PROFILE.email && password === QA_PROFILE.password) {
      window.sessionStorage.setItem(SESSION, QA_PROFILE.email);
      router.push("/mesa/inbox");
      return;
    }
    setError("That profile is not authorized for Mesa QA.");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="font-heading text-4xl text-[#1d2a24]">Sign in</h1>
        <p className="mt-2 text-sm text-[#5c6a62]">Use the seeded QA profile to open the inbox.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#d7cfc0]">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-[#1d2a24]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white text-[#1d2a24]"
          />
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not sign in</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </main>
  );
}
