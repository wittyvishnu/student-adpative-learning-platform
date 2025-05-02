import Link from "next/link";
import Logo from "@/components/layout/logo";
import UserMenu from "@/components/layout/user-menu";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex gap-6">
            <Link
              href="/dashboard/courses"
              className={`text-sm font-medium ${true ? "text-[#9efa35]" : "text-foreground"}`}
            >
              Courses
            </Link>
            <Link
              href="/dashboard/how-it-works"
              className="text-sm font-medium text-foreground"
            >
              how-it-works
            </Link>
            <Link
              href="/dashboard/upgrade"
              className="text-sm font-medium text-foreground"
            >
              upgrade
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
