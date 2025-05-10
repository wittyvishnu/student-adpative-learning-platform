"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, BarChart2, LayoutDashboard } from "lucide-react"
import UserMenu from "@/components/layout/user-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import Logo from "@/components/layout/logo"
import { usePathname } from "next/navigation";


export default function Header() {
  const [activeLink, setActiveLink] = useState("dashboard")
  const pathname = usePathname();

  return (
    <header className="backdrop-blur-lg bg-white/30 border-b border-white/20 shadow-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Mobile menu button */}
           <div className="hidden md:block ml-5 mr-5">
                  <Logo />
                </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/dashboard/courses"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Courses
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    <BarChart2 className="h-4 w-4" />
                    Reports
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/dashboard/how-it-works"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    How It Works
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/dashboard/upgrade"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 "
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Upgrade
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation */}
         <nav className="hidden md:flex gap-6">
  <Link
    href="/dashboard"
    className={`text-sm font-medium ${pathname === "/dashboard" ? "text-[#9efa35] w-[0_1px_1px_rgba(0,0,0,0.6)]" : "text-foreground"} hover:text-[#9efa35]`}
  >
    Dashboard
  </Link>
  <Link
    href="/dashboard/courses"
    className={`text-sm font-medium ${pathname === "/dashboard/courses" ? "text-[#9efa35] w-[0_1px_1px_rgba(0,0,0,0.6)]" : "text-foreground"} hover:text-[#9efa35]` }
  >
    Courses
  </Link>
  <Link
    href="/dashboard/reports"
    className={`text-sm font-medium ${pathname === "/dashboard/reports" ? "text-[#9efa35] w-[0_1px_1px_rgba(0,0,0,0.6)]" : "text-foreground"} hover:text-[#9efa35]`}
  >
    Reports
  </Link>
  <Link
    href="/dashboard/how-it-works"
    className={`text-sm font-medium ${pathname === "/dashboard/how-it-works" ? "text-[#9efa35] w-[0_1px_1px_rgba(0,0,0,0.6)]" : "text-foreground"} hover:text-[#9efa35]`}
  >
    How It Works
  </Link>
  <Link
    href="/dashboard/upgrade"
    className={`text-sm font-medium ${pathname === "/dashboard/upgrade" ? "text-[#9efa35] w-[0_1px_1px_rgba(0,0,0,0.6)]" : "text-foreground"} hover:text-[#9efa35]`}
  >
    Upgrade
  </Link>
</nav>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
