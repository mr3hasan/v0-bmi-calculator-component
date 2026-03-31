"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

type Gender = "male" | "female"

interface BodyFatResult {
  percentage: number
  category: string
  categoryKey: string
}

const categories = {
  male: [
    { min: 0, max: 5, key: "essential" },
    { min: 6, max: 13, key: "athletes" },
    { min: 14, max: 17, key: "fitness" },
    { min: 18, max: 24, key: "acceptable" },
    { min: 25, max: 100, key: "obeseFat" },
  ],
  female: [
    { min: 0, max: 13, key: "essential" },
    { min: 14, max: 20, key: "athletes" },
    { min: 21, max: 24, key: "fitness" },
    { min: 25, max: 31, key: "acceptable" },
    { min: 32, max: 100, key: "obeseFat" },
  ],
}

const categoryColors: Record<string, string> = {
  essential: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  athletes: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  fitness: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
  acceptable: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  obeseFat: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
}

export function BodyFatCalculator() {
  const { t } = useLanguage()
  const [gender, setGender] = useState<Gender>("male")
  const [heightCm, setHeightCm] = useState<string>("")
  const [waist, setWaist] = useState<string>("")
  const [neck, setNeck] = useState<string>("")
  const [hip, setHip] = useState<string>("")
  const [result, setResult] = useState<BodyFatResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateBodyFat = () => {
    const height = parseFloat(heightCm)
    const waistCm = parseFloat(waist)
    const neckCm = parseFloat(neck)
    const hipCm = parseFloat(hip)

    if (!height || !waistCm || !neckCm) return
    if (gender === "female" && !hipCm) return

    setIsCalculating(true)

    setTimeout(() => {
      let bodyFat: number

      // US Navy Method
      if (gender === "male") {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(height)) - 450
      } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(height)) - 450
      }

      bodyFat = Math.max(0, Math.min(100, bodyFat))

      const category = categories[gender].find(
        (c) => bodyFat >= c.min && bodyFat <= c.max
      )

      setResult({
        percentage: Math.round(bodyFat * 10) / 10,
        category: category ? t(category.key) : "",
        categoryKey: category?.key || "acceptable",
      })
      setIsCalculating(false)
    }, 500)
  }

  const isValid = heightCm && waist && neck && (gender === "male" || hip)

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("bodyFat")}</h2>

        <div className="space-y-4">
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

          {/* Neck */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("neck")} ({t("cm")})</label>
            <input
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="38"
            />
          </div>

          {/* Waist */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("waist")} ({t("cm")})</label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="85"
            />
          </div>

          {/* Hip (for females) */}
          {gender === "female" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm text-muted-foreground mb-1.5 block">{t("hip")} ({t("cm")})</label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                placeholder="95"
              />
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateBodyFat}
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
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{t("bodyFatPercentage")}</h3>

          {/* Main Result */}
          <div className={cn("p-5 rounded-xl border mb-4", categoryColors[result.categoryKey])}>
            <div className="text-center">
              <span className="text-4xl font-bold">{result.percentage}%</span>
              <p className="text-sm mt-1 font-medium">{result.category}</p>
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-2">
            {categories[gender].map((cat) => (
              <div
                key={cat.key}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                  result.categoryKey === cat.key ? "bg-muted/50 border border-border/50" : ""
                )}
              >
                <span className="text-sm text-muted-foreground">{t(cat.key)}</span>
                <span className="text-sm font-medium text-foreground">
                  {cat.min}-{cat.max === 100 ? "+" : cat.max}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
