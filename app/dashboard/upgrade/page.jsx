import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

export default function UpgradePage() {
  return (
    <div className="container px-4 py-6 md:py-10  bg-[#f9f9f9]">
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Upgrade Your Learning Experience</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals and take your skills to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* Basic Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Basic</CardTitle>
              <CardDescription>For casual learners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Access to free courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Community forum access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Basic coding exercises</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Mock interviews</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Certifications</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Advanced courses</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-[#9efa35] relative md:scale-105 shadow-lg">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#9efa35] text-black px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>For serious learners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>All Basic features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Full course library access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Advanced coding exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>2 mock interviews per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Course completion certificates</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Career coaching</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#9efa35] hover:bg-[#9efa35]/90 text-black">Upgrade to Pro</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <CardDescription>For career changers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Unlimited mock interviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>1-on-1 career coaching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Resume & portfolio review</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Industry-recognized certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#9efa35] mt-0.5 shrink-0" />
                  <span>Job placement assistance</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Upgrade to Enterprise
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Can I switch plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will take effect at
                the start of your next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support
                team within 7 days of purchase.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">How do mock interviews work?</h3>
              <p className="text-muted-foreground">
                Mock interviews are conducted via video call with experienced industry professionals who will provide
                feedback and guidance to improve your performance.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Are certifications recognized by employers?</h3>
              <p className="text-muted-foreground">
                Our certifications are designed to demonstrate your skills to employers. Many of our enterprise partners
                recognize and value our certifications in their hiring process.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you choose the right plan for your learning goals.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </div>
  )
}
