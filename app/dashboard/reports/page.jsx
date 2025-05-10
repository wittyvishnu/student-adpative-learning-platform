import { Suspense } from "react"
import ReportsContent from "@/components/reports/reports-content"
import ReportsLoading from "@/components/reports/reports-loading"

export default function ReportsPage() {
  return (
    <div className="container px-4 py-8 md:px-6  bg-[#f9f9f9]">
      <Suspense fallback={<ReportsLoading />}>
        <ReportsContent />
      </Suspense>
    </div>
  )
}
