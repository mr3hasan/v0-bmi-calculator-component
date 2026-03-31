"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

type Gender = "male" | "female"

interface WeightResult {
  robinson: number
  miller: number
  devine: number
  hamwi: number
  average: number
}

export function IdealWeightCalculator() {
  const { t } = useLanguage()
  const [gender, setGender] = useState<Gender>("male")
  const [feet, setFeet] = useState<string>("")
  const [inches, setInches] = useState<string>("")
  const [result, setResult] = useState<WeightResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateWeight = () => {
    const feetNum = parseInt(feet) || 0
    const inchesNum = parseInt(inches) || 0
    const totalInches = feetNum * 12 + inchesNum

    if (totalInches < 60) return // Minimum 5 feet

    setIsCalculating(true)

    setTimeout(() => {
      const inchesOver5Feet = totalInches - 60

      let robinson: number, miller: number, devine: number, hamwi: number

      if (gender === "male") {
        robinson = 52 + 1.9 * inchesOver5Feet
        miller = 56.2 + 1.41 * inchesOver5Feet
        devine = 50 + 2.3 * inchesOver5Feet
        hamwi = 48 + 2.7 * inchesOver5Feet
      } else {
        robinson = 49 + 1.7 * inchesOver5Feet
        miller = 53.1 + 1.36 * inchesOver5Feet
        devine = 45.5 + 2.3 * inchesOver5Feet
        hamwi = 45.5 + 2.2 * inchesOver5Feet
      }

      const average = (robinson + miller + devine + hamwi) / 4

      setResult({
        robinson: Math.round(robinson * 10) / 10,
        miller: Math.round(miller * 10) / 10,
        devine: Math.round(devine * 10) / 10,
        hamwi: Math.round(hamwi * 10) / 10,
        average: Math.round(average * 10) / 10,
      })
      setIsCalculating(false)
    }, 500)
  }

  const isValid = feet && parseInt(feet) >= 5

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("idealWeight")}</h2>

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
            <label className="text-sm text-muted-foreground mb-1.5 block">{t("height")}</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  placeholder="5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t("feet")}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  placeholder="8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t("inches")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateWeight}
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
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{t("idealWeightTitle")}</h3>

          {/* Average */}
          <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20 mb-4">
            <div className="text-center">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">{t("average")}</span>
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{result.average}</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 ml-1">{t("kg")}</span>
            </div>
          </div>

          {/* Formulas */}
          <div className="grid grid-cols-2 gap-3">
            {(["robinson", "miller", "devine", "hamwi"] as const).map((formula) => (
              <div key={formula} className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                <span className="text-xs text-muted-foreground block mb-1">{t(formula)}</span>
                <span className="text-lg font-bold text-foreground">{result[formula]}</span>
                <span className="text-xs text-muted-foreground ml-1">{t("kg")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
