"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

interface PregnancyResult {
  dueDate: Date
  conceptionDate: Date
  currentWeek: number
  currentDay: number
  trimester: number
  daysRemaining: number
  progress: number
}

export function PregnancyCalculator() {
  const { t } = useLanguage()
  const [lastPeriod, setLastPeriod] = useState<string>("")
  const [result, setResult] = useState<PregnancyResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateDueDate = () => {
    if (!lastPeriod) return

    setIsCalculating(true)

    setTimeout(() => {
      const lmp = new Date(lastPeriod)
      const today = new Date()

      // Naegele's Rule: LMP + 280 days (40 weeks)
      const dueDate = new Date(lmp)
      dueDate.setDate(dueDate.getDate() + 280)

      // Conception date (approximately 2 weeks after LMP)
      const conceptionDate = new Date(lmp)
      conceptionDate.setDate(conceptionDate.getDate() + 14)

      // Days since LMP
      const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24))
      const currentWeek = Math.floor(daysSinceLMP / 7)
      const currentDay = daysSinceLMP % 7

      // Trimester
      let trimester = 1
      if (currentWeek >= 13 && currentWeek < 27) trimester = 2
      else if (currentWeek >= 27) trimester = 3

      // Days remaining
      const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

      // Progress percentage
      const progress = Math.min(100, Math.max(0, (daysSinceLMP / 280) * 100))

      setResult({
        dueDate,
        conceptionDate,
        currentWeek,
        currentDay,
        trimester,
        daysRemaining,
        progress,
      })
      setIsCalculating(false)
    }, 500)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isValid = lastPeriod && new Date(lastPeriod) <= new Date()

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("pregnancy")}</h2>

        <div className="space-y-4">
          {/* Last Period Date */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("lastPeriod")}</label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateDueDate}
          disabled={!isValid || isCalculating}
          className={cn(
            "w-full h-14 mt-6 rounded-2xl font-semibold text-base transition-all duration-300",
            isValid
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isCalculating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("calculate")}...
            </span>
          ) : (
            t("calculate")
          )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Due Date */}
          <div className="p-5 bg-gradient-to-r from-pink-500/10 to-pink-500/5 rounded-xl border border-pink-500/20 mb-4">
            <div className="text-center">
              <span className="text-xs text-pink-600 dark:text-pink-400 block mb-1">{t("dueDate")}</span>
              <span className="text-xl font-bold text-pink-600 dark:text-pink-400">{formatDate(result.dueDate)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t("currentWeek")} {result.currentWeek}+{result.currentDay}</span>
              <span className="text-muted-foreground">{Math.round(result.progress)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                style={{ width: `${result.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>40 {t("weeks")}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
              <span className="text-xs text-muted-foreground block mb-1">{t("trimester")}</span>
              <span className="text-lg font-bold text-foreground">
                {result.trimester === 1 && t("first")}
                {result.trimester === 2 && t("second")}
                {result.trimester === 3 && t("third")}
              </span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
              <span className="text-xs text-muted-foreground block mb-1">{t("daysRemaining")}</span>
              <span className="text-lg font-bold text-foreground">{result.daysRemaining}</span>
            </div>
          </div>

          {/* Conception Date */}
          <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("conception")}</span>
              <span className="text-sm font-medium text-foreground">{formatDate(result.conceptionDate)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
