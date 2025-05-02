import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/logo"
import { Facebook, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1c1c24] text-white">
      <div className="container px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-2">
              <Link href="/about-us" className="block text-sm">
                About us
              </Link>
              <Link href="/services" className="block text-sm">
                Services
              </Link>
              <Link href="/use-cases" className="block text-sm">
                Use Cases
              </Link>
              <Link href="/pricing" className="block text-sm">
                Pricing
              </Link>
              <Link href="/blog" className="block text-sm">
                Blog
              </Link>
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-[#9efa35] text-black px-3 py-1 text-sm font-medium rounded">
                Contact us:
              </div>
              <div className="space-y-1">
                <p className="text-sm">Email: info@positivus.com</p>
                <p className="text-sm">Phone: 555-567-8901</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex gap-4">
                  <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="flex gap-2">
                <Input className="bg-[#2c2c34] border-0 text-white" placeholder="Email" />
                <Button className="bg-[#9efa35] text-black hover:bg-[#8de42d]">Connect us</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-sm text-gray-400">© 2023 Positivus. All Rights Reserved.</p>
            <Link href="/privacy-policy" className="text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
