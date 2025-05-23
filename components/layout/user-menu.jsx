"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserMenu() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut, openSignUp } = useClerk();

  // Show nothing while loading - the header will show its own skeleton
  if (!isLoaded) return null;

  // Show sign up button if user is not authenticated
  if (!user) {
    return (
      <Button variant="outline" onClick={() => openSignUp()}>
        Sign Up
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-1 py-0 rounded-full hover:bg-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName || "User"}
            />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => openUserProfile()}>Profile</DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}