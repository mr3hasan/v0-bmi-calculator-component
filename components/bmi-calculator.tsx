"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BMIResult {
  value: number
  category: string
  color: string
  description: string
}

function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) {
    return {
      value: bmi,
      category: "Underweight",
      color: "#3B82F6", // Blue
      description: "You are in the Underweight range. Consider consulting a nutritionist.",
    }
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      value: bmi,
      category: "Normal",
      color: "#22C55E", // Green
      description: "You are in the Healthy range. Keep up the good work!",
    }
  } else if (bmi >= 25 && bmi < 30) {
    return {
      value: bmi,
      category: "Overweight",
      color: "#F97316", // Orange
      description: "You are in the Overweight range. Consider a balanced diet and exercise.",
    }
  } else {
    return {
      value: bmi,
      category: "Obese",
      color: "#EF4444", // Red
      description: "You are in the Obese range. Please consult a healthcare professional.",
    }
  }
}

function CircularGauge({
  bmi,
  result,
  isAnimating,
}: {
  bmi: number
  result: BMIResult | null
  isAnimating: boolean
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [strokeDashoffset, setStrokeDashoffset] = useState(283)

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const semiCircumference = circumference / 2

  useEffect(() => {
    if (isAnimating && result) {
      // Animate the number
      const duration = 1000
      const startTime = Date.now()
      const startValue = 0
      const endValue = result.value

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setAnimatedValue(startValue + (endValue - startValue) * easeOut)

        // Animate the stroke (max BMI shown is 40 for gauge purposes)
        const normalizedBMI = Math.min(result.value, 40) / 40
        const targetOffset = semiCircumference * (1 - normalizedBMI)
        setStrokeDashoffset(semiCircumference - (semiCircumference - targetOffset) * easeOut)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    } else if (!result) {
      setAnimatedValue(0)
      setStrokeDashoffset(semiCircumference)
    }
  }, [isAnimating, result, semiCircumference])

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible">
        {/* Background arc */}
        <path
          d="M 20 120 A 90 90 0 0 1 220 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          className="text-muted/30"
        />
        {/* Animated progress arc */}
        <path
          d="M 20 120 A 90 90 0 0 1 220 120"
          fill="none"
          stroke={result?.color || "#E5E7EB"}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={semiCircumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke 0.5s ease-out",
            filter: result ? `drop-shadow(0 0 8px ${result.color}40)` : "none",
          }}
        />
        {/* BMI Scale markers */}
        {[18.5, 25, 30].map((marker, i) => {
          const angle = Math.PI - (marker / 40) * Math.PI
          const x = 120 + 90 * Math.cos(angle)
          const y = 120 - 90 * Math.sin(angle)
          return (
            <g key={marker}>
              <circle cx={x} cy={y} r="3" fill="currentColor" className="text-muted-foreground/50" />
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {marker}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
        <div
          className="text-5xl font-bold tracking-tight transition-colors duration-500"
          style={{ color: result?.color || "var(--muted-foreground)" }}
        >
          {result ? animatedValue.toFixed(1) : "--"}
        </div>
        <div className="text-sm text-muted-foreground mt-1">BMI</div>
      </div>
    </div>
  )
}

export function BMICalculator() {
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [feet, setFeet] = useState<string>("")
  const [inches, setInches] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [result, setResult] = useState<BMIResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasCalculated, setHasCalculated] = useState(false)

  const calculateBMI = () => {
    const feetNum = parseFloat(feet) || 0
    const inchesNum = parseFloat(inches) || 0
    const weightNum = parseFloat(weight) || 0

    if (feetNum <= 0 || weightNum <= 0) {
      return
    }

    // Convert height to meters
    const totalInches = feetNum * 12 + inchesNum
    const heightInMeters = totalInches * 0.0254

    // Calculate BMI
    const bmi = weightNum / (heightInMeters * heightInMeters)

    setIsAnimating(false)
    setTimeout(() => {
      setResult(getBMIResult(bmi))
      setIsAnimating(true)
      setHasCalculated(true)
    }, 50)
  }

  const isFormValid = parseFloat(feet) > 0 && parseFloat(weight) > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Input Card */}
        <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 space-y-6 border border-border/50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">BMI Calculator</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Calculate your Body Mass Index
            </p>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Gender Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender("male")}
                className={cn(
                  "flex-1 h-12 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
                  gender === "male"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="14" r="6" />
                  <path d="M14.5 9.5 21 3" />
                  <path d="M21 9V3h-6" />
                </svg>
                Male
              </button>
              <button
                onClick={() => setGender("female")}
                className={cn(
                  "flex-1 h-12 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
                  gender === "female"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M12 14v7" />
                  <path d="M9 18h6" />
                </svg>
                Female
              </button>
            </div>
          </div>

          {/* Height Inputs */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Height</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="Feet"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ft
                </span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  placeholder="Inches"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  in
                </span>
              </div>
            </div>
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Weight</label>
            <div className="relative">
              <input
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                kg
              </span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 border border-border/50">
          <CircularGauge bmi={result?.value || 0} result={result} isAnimating={isAnimating} />

          {/* Category Badge */}
          <div className="flex justify-center mt-4">
            {result ? (
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-500"
                style={{ backgroundColor: result.color }}
              >
                {result.category}
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                Enter your details
              </span>
            )}
          </div>

          {/* Description */}
          <p
            className={cn(
              "text-center text-sm mt-4 transition-all duration-500",
              result ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {result?.description || "Fill in the form above and click Calculate to see your BMI result."}
          </p>

          {/* BMI Scale Legend */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {[
              { label: "Underweight", color: "#3B82F6", range: "<18.5" },
              { label: "Normal", color: "#22C55E", range: "18.5-24.9" },
              { label: "Overweight", color: "#F97316", range: "25-29.9" },
              { label: "Obese", color: "#EF4444", range: "≥30" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.range}</span>
              </div>
            ))}
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateBMI}
            disabled={!isFormValid}
            className={cn(
              "w-full h-14 mt-6 rounded-xl font-semibold text-lg transition-all duration-300",
              isFormValid
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {hasCalculated ? "Recalculate" : "Calculate BMI"}
          </button>
        </div>
      </div>
    </div>
  )
}
