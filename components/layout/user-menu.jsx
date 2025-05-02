"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function UserMenu() {
  const { openUserProfile, signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <ChevronDown className="absolute right-0 bottom-0 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Reports</DropdownMenuItem>
        <DropdownMenuItem>Certifications</DropdownMenuItem>
        <DropdownMenuItem onClick={openUserProfile}>Profile</DropdownMenuItem>
        <DropdownMenuItem>Activities</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem>Get Started</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
