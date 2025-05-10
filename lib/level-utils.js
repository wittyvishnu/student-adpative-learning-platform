// Level thresholds - each level requires more points than the previous
export const LEVEL_THRESHOLDS = [
    { level: 1, points: 0 },
    { level: 2, points: 100 },
    { level: 3, points: 200 },
    { level: 4, points: 300 },
    { level: 5, points: 400 },
    { level: 6, points: 500 },
    { level: 7, points: 600 },
    { level: 8, points: 700 },
    { level: 9, points: 800 },
    { level: 10, points: 900 },
    { level: 11, points: 1000 },
    { level: 12, points: 1100 },
    { level: 13, points: 1200 },
    { level: 14, points: 1300 },
    { level: 15, points: 1400 },
    { level: 16, points: 1500 },
    { level: 17, points: 1600 },
    { level: 18, points: 1700 },
    { level: 19, points: 1800 },
    { level: 20, points: 1900 },
    { level: 21, points: 2000 },
    { level: 22, points: 2100 },
    { level: 23, points: 2200 },
    { level: 24, points: 2300 },
    { level: 25, points: 2400 },
    { level: 30, points: 2900 },
    { level: 35, points: 3400 },
    { level: 40, points: 3900 },
    { level: 45, points: 4400 },
    { level: 50, points: 4900 },
    { level: 55, points: 5400 },
    { level: 60, points: 5900 },
    { level: 65, points: 6400 },
    { level: 70, points: 6900 },
    { level: 75, points: 7400 },
    { level: 80, points: 7900 },
    { level: 85, points: 8400 },
    { level: 90, points: 8900 },
    { level: 95, points: 9400 },
    { level: 100, points: 9900 },
  ]
  
  // Level names and their ranges
  const LEVEL_RANGES = [
    { min: 1, max: 9, name: "Beginner" },
    { min: 10, max: 29, name: "Novice" },
    { min: 30, max: 49, name: "Intermediate" },
    { min: 50, max: 69, name: "Advanced" },
    { min: 70, max: 89, name: "Expert" },
    { min: 90, max: 100, name: "Master" },
  ]
  
  // Get level name from level number
  export function getLevelName(level) {
    for (const range of LEVEL_RANGES) {
      if (level >= range.min && level <= range.max) {
        return range.name
      }
    }
    return "Unknown"
  }
  
  // Get level color from level number
  export function getLevelColor(level) {
    if (level < 10) return "bg-gray-500"
    if (level < 30) return "bg-green-500"
    if (level < 50) return "bg-blue-500"
    if (level < 70) return "bg-yellow-500"
    if (level < 90) return "bg-orange-500"
    return "bg-purple-500"
  }
  
  // Calculate level from points
  export function calculateLevelFromPoints(points) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (points >= LEVEL_THRESHOLDS[i].points) {
        const currentLevel = LEVEL_THRESHOLDS[i].level
        const nextLevelIndex = i < LEVEL_THRESHOLDS.length - 1 ? i + 1 : i
        const nextLevelPoints = LEVEL_THRESHOLDS[nextLevelIndex].points
  
        return {
          currentLevel,
          currentXP: points,
          nextLevelXP: nextLevelPoints,
        }
      }
    }
  
    return {
      currentLevel: 1,
      currentXP: points,
      nextLevelXP: LEVEL_THRESHOLDS[1].points,
    }
  }
  