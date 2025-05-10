export default function ActivityChart({ data = [] }) {
  // If no data is provided, use default data
  const chartData = data.length > 0 
    ? data 
    : [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 0 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 0 },
      ];

  // Find the maximum value for scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="h-[100px] w-full">
      <div className="flex h-full items-end gap-1">
        {chartData.map((item, i) => (
          <div 
            key={i} 
            className="flex-1 bg-blue-500 rounded-t" 
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          >
            <div className="sr-only">{item.value} activities on {item.day}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {chartData.map((item, i) => (
          <div key={i}>{item.day}</div>
        ))}
      </div>
    </div>
  )
}
