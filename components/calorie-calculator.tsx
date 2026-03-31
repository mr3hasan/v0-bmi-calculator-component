"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

type Gender = "male" | "female"
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra"

interface CalorieResult {
  bmr: number
  maintain: number
  lose: number
  gain: number
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
}

export function CalorieCalculator() {
  const { t } = useLanguage()
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<Gender>("male")
  const [heightCm, setHeightCm] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [activity, setActivity] = useState<ActivityLevel>("moderate")
  const [result, setResult] = useState<CalorieResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateCalories = () => {
    const ageNum = parseInt(age)
    const heightNum = parseFloat(heightCm)
    const weightNum = parseFloat(weight)

    if (!ageNum || !heightNum || !weightNum) return

    setIsCalculating(true)

    setTimeout(() => {
      // Mifflin-St Jeor Equation
      let bmr: number
      if (gender === "male") {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      } else {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161
      }

      const maintain = Math.round(bmr * activityMultipliers[activity])
      const lose = Math.round(maintain - 500)
      const gain = Math.round(maintain + 500)

      setResult({
        bmr: Math.round(bmr),
        maintain,
        lose,
        gain,
      })
      setIsCalculating(false)
    }, 500)
  }

  const isValid = age && heightCm && weight

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("calorieCalculator")}</h2>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("age")}</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="25"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("gender")}</label>
            <div className="grid grid-cols-2 gap-2">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    "h-12 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2",
                    gender === g
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                  )}
                >
                  {t(g)}
                </button>
              ))}
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("height")} ({t("cm")})</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="170"
            />
          </div>

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
            <div className="grid grid-cols-1 gap-2">
              {(["sedentary", "light", "moderate", "very", "extra"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActivity(level)}
                  className={cn(
                    "h-11 px-4 rounded-xl font-medium text-sm transition-all duration-300 text-left",
                    activity === level
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                  )}
                >
                  {level === "sedentary" && t("sedentary")}
                  {level === "light" && t("lightlyActive")}
                  {level === "moderate" && t("moderatelyActive")}
                  {level === "very" && t("veryActive")}
                  {level === "extra" && t("extraActive")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateCalories}
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
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{t("dailyCalories")}</h3>

          {/* BMR */}
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50 mb-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block mb-1">{t("bmr")}</span>
              <span className="text-2xl font-bold text-foreground">{result.bmr.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">{t("calories")}</span>
            </div>
          </div>

          {/* Calorie Goals */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-center">
              <span className="text-xs text-orange-600 dark:text-orange-400 block mb-1">{t("toLose")}</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.lose.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">{t("toMaintain")}</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.maintain.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 block mb-1">{t("toGain")}</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{result.gain.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
