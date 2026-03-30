"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  nextBirthday: number
}

function calculateAge(birthDate: Date): AgeResult {
  const today = new Date()
  const birth = new Date(birthDate)

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += lastMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  // Calculate total time units
  const timeDiff = today.getTime() - birth.getTime()
  const totalSeconds = Math.floor(timeDiff / 1000)
  const totalMinutes = Math.floor(timeDiff / (1000 * 60))
  const totalHours = Math.floor(timeDiff / (1000 * 60 * 60))
  const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)

  // Calculate days until next birthday
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthday: daysUntilBirthday,
  }
}

function ResultCard({
  value,
  label,
  color,
  delay,
}: {
  value: number
  label: string
  color: string
  delay: number
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useState(() => {
    const timeout = setTimeout(() => {
      const duration = 1000
      const startTime = Date.now()

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setAnimatedValue(Math.round(value * easeOut))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setHasAnimated(true)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  })

  return (
    <div
      className="bg-muted/30 rounded-2xl p-5 text-center border border-border/50 transition-all duration-500 hover:shadow-lg hover:scale-[1.02]"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="text-4xl font-bold mb-1 transition-colors duration-300"
        style={{ color }}
      >
        {hasAnimated ? value : animatedValue}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  )
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("")
  const [result, setResult] = useState<AgeResult | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const handleCalculate = () => {
    if (!birthDate) return

    const date = new Date(birthDate)
    const today = new Date()

    if (date > today) {
      return
    }

    setResult(null)
    setTimeout(() => {
      setResult(calculateAge(date))
      setHasCalculated(true)
    }, 50)
  }

  const isFormValid = birthDate !== "" && new Date(birthDate) <= new Date()

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 space-y-6 border border-border/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Age Calculator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate your exact age in years, months, and days
          </p>
        </div>

        {/* Date of Birth Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!isFormValid}
          className={cn(
            "w-full h-14 rounded-xl font-semibold text-lg transition-all duration-300",
            isFormValid
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {hasCalculated ? "Recalculate" : "Calculate Age"}
        </button>
      </div>

      {/* Result Card */}
      <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 border border-border/50">
        {result ? (
          <>
            {/* Main Age Display */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <ResultCard value={result.years} label="Years" color="#22C55E" delay={0} />
              <ResultCard value={result.months} label="Months" color="#3B82F6" delay={100} />
              <ResultCard value={result.days} label="Days" color="#F97316" delay={200} />
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">Total Weeks</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalWeeks.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">Total Days</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalDays.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">Total Hours</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalHours.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">Total Minutes</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalMinutes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Seconds Counter */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-4">
              <div className="text-center">
                <span className="text-xs text-muted-foreground block mb-1">Total Seconds Lived</span>
                <span className="text-2xl font-bold text-primary">
                  {result.totalSeconds.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Next Birthday */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Next Birthday In</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {result.nextBirthday === 0 ? "Today!" : `${result.nextBirthday} days`}
              </span>
            </div>

            {/* Summary */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              You are{" "}
              <span className="font-semibold text-foreground">
                {result.years} years, {result.months} months, and {result.days} days
              </span>{" "}
              old
            </p>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              Select your date of birth and click Calculate to see your age
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
