import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-[80px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="md:col-span-1">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-[80px] mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[150px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
