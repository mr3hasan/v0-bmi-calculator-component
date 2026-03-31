"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

type ActivityLevel = "sedentary" | "moderate" | "active"

interface WaterResult {
  liters: number
  glasses: number
}

export function WaterCalculator() {
  const { t } = useLanguage()
  const [weight, setWeight] = useState<string>("")
  const [activity, setActivity] = useState<ActivityLevel>("moderate")
  const [result, setResult] = useState<WaterResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateWater = () => {
    const weightNum = parseFloat(weight)
    if (!weightNum) return

    setIsCalculating(true)

    setTimeout(() => {
      // Base: 35ml per kg
      let waterMl = weightNum * 35

      // Activity multiplier
      if (activity === "moderate") {
        waterMl *= 1.2
      } else if (activity === "active") {
        waterMl *= 1.4
      }

      const liters = Math.round(waterMl / 100) / 10
      const glasses = Math.round(waterMl / 250)

      setResult({ liters, glasses })
      setIsCalculating(false)
    }, 500)
  }

  const isValid = weight && parseFloat(weight) > 0

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("waterIntake")}</h2>

        <div className="space-y-4">
          {/* Weight */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("weight")} ({t("kg")})</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="70"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("activityLevel")}</label>
            <div className="grid grid-cols-3 gap-2">
              {(["sedentary", "moderate", "active"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivity(level)}
                  className={cn(
                    "h-12 rounded-xl font-medium text-xs transition-all duration-300 flex items-center justify-center",
                    activity === level
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                  )}
                >
                  {level === "sedentary" && t("sedentary")}
                  {level === "moderate" && t("moderatelyActive")}
                  {level === "active" && t("veryActive")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateWater}
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
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{t("waterIntakeTitle")}</h3>

          {/* Water Drop Visual */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width="120" height="150" viewBox="0 0 120 150" className="text-blue-500">
                <path
                  d="M60 0C60 0 0 60 0 100C0 127.614 26.863 150 60 150C93.137 150 120 127.614 120 100C120 60 60 0 60 0Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
                <path
                  d="M60 0C60 0 0 60 0 100C0 127.614 26.863 150 60 150C93.137 150 120 127.614 120 100C120 60 60 0 60 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.liters}</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">{t("liters")}</span>
              </div>
            </div>
          </div>

          {/* Glasses */}
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600 dark:text-blue-400"
              >
                <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
                <path d="M9 12v6" />
                <path d="M13 12v6" />
                <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1 3 1 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
                <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
              </svg>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.glasses}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">{t("glasses")}</span>
            </div>
          </div>

          {/* Tip */}
          <p className="text-center text-sm text-muted-foreground">{t("waterTip")}</p>
        </div>
      )}
    </div>
  )
}
