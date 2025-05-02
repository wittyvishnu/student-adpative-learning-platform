export default function ActivityChart() {
  return (
    <div className="h-[100px] w-full">
      <div className="flex h-full items-end gap-1">
        {[40, 60, 70, 30, 50, 20, 80, 60, 40, 70, 90, 100].map((height, i) => (
          <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <div>JAN</div>
        <div>FEB</div>
        <div>MAR</div>
        <div>APR</div>
        <div>MAY</div>
        <div>JUN</div>
        <div>JUL</div>
        <div>AUG</div>
        <div>SEP</div>
        <div>OCT</div>
        <div>NOV</div>
        <div>DEC</div>
      </div>
    </div>
  )
}
