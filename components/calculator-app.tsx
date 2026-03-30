"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { BMICalculatorContent } from "./bmi-calculator-content"
import { AgeCalculator } from "./age-calculator"

type TabType = "bmi" | "age"

export function CalculatorApp() {
  useServiceWorker()
  const [activeTab, setActiveTab] = useState<TabType>("bmi")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center p-4 pt-6">
      {/* Tab Switcher */}
      <div className="w-full max-w-md mb-6">
        <div className="bg-card rounded-2xl p-1.5 shadow-lg shadow-black/5 border border-border/50 flex gap-1.5">
          <button
            onClick={() => setActiveTab("bmi")}
            className={cn(
              "flex-1 h-12 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "bmi"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            BMI Calculator
          </button>
          <button
            onClick={() => setActiveTab("age")}
            className={cn(
              "flex-1 h-12 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "age"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Age Calculator
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex justify-center">
        {activeTab === "bmi" ? <BMICalculatorContent /> : <AgeCalculator />}
      </div>
    </div>
  )
}
