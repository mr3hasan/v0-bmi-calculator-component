"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

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
  zodiacSign: string
  zodiacSymbol: string
  chineseZodiac: string
  chineseSymbol: string
  generation: string
}

const zodiacSigns = [
  { name: "Capricorn", symbol: "Makara", bn: "মকর", start: [1, 1], end: [1, 19] },
  { name: "Aquarius", symbol: "Kumbha", bn: "কুম্ভ", start: [1, 20], end: [2, 18] },
  { name: "Pisces", symbol: "Meena", bn: "মীন", start: [2, 19], end: [3, 20] },
  { name: "Aries", symbol: "Mesha", bn: "মেষ", start: [3, 21], end: [4, 19] },
  { name: "Taurus", symbol: "Vrishabha", bn: "বৃষ", start: [4, 20], end: [5, 20] },
  { name: "Gemini", symbol: "Mithuna", bn: "মিথুন", start: [5, 21], end: [6, 20] },
  { name: "Cancer", symbol: "Karka", bn: "কর্কট", start: [6, 21], end: [7, 22] },
  { name: "Leo", symbol: "Simha", bn: "সিংহ", start: [7, 23], end: [8, 22] },
  { name: "Virgo", symbol: "Kanya", bn: "কন্যা", start: [8, 23], end: [9, 22] },
  { name: "Libra", symbol: "Tula", bn: "তুলা", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", symbol: "Vrishchika", bn: "বৃশ্চিক", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", symbol: "Dhanu", bn: "ধনু", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", symbol: "Makara", bn: "মকর", start: [12, 22], end: [12, 31] },
]

const chineseZodiacs = [
  { name: "Rat", bn: "ইঁদুর", symbol: "🐀" },
  { name: "Ox", bn: "গরু", symbol: "🐂" },
  { name: "Tiger", bn: "বাঘ", symbol: "🐅" },
  { name: "Rabbit", bn: "খরগোশ", symbol: "🐇" },
  { name: "Dragon", bn: "ড্রাগন", symbol: "🐉" },
  { name: "Snake", bn: "সাপ", symbol: "🐍" },
  { name: "Horse", bn: "ঘোড়া", symbol: "🐴" },
  { name: "Goat", bn: "ছাগল", symbol: "🐐" },
  { name: "Monkey", bn: "বানর", symbol: "🐵" },
  { name: "Rooster", bn: "মোরগ", symbol: "🐓" },
  { name: "Dog", bn: "কুকুর", symbol: "🐕" },
  { name: "Pig", bn: "শূকর", symbol: "🐷" },
]

const generations = [
  { name: "Greatest Generation", bn: "সর্বশ্রেষ্ঠ প্রজন্ম", start: 1901, end: 1927 },
  { name: "Silent Generation", bn: "নীরব প্রজন্ম", start: 1928, end: 1945 },
  { name: "Baby Boomers", bn: "বেবি বুমার্স", start: 1946, end: 1964 },
  { name: "Generation X", bn: "জেনারেশন এক্স", start: 1965, end: 1980 },
  { name: "Millennials", bn: "মিলেনিয়াল", start: 1981, end: 1996 },
  { name: "Generation Z", bn: "জেনারেশন জেড", start: 1997, end: 2012 },
  { name: "Generation Alpha", bn: "জেনারেশন আলফা", start: 2013, end: 2030 },
]

function getZodiacSign(month: number, day: number, language: string): { name: string; symbol: string } {
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start
    const [endMonth, endDay] = sign.end
    
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return { 
        name: language === "bn" ? sign.bn : sign.name, 
        symbol: sign.symbol 
      }
    }
  }
  return { name: language === "bn" ? "মকর" : "Capricorn", symbol: "Makara" }
}

function getChineseZodiac(year: number, language: string): { name: string; symbol: string } {
  const index = (year - 4) % 12
  const zodiac = chineseZodiacs[index]
  return { 
    name: language === "bn" ? zodiac.bn : zodiac.name, 
    symbol: zodiac.symbol 
  }
}

function getGeneration(year: number, language: string): string {
  for (const gen of generations) {
    if (year >= gen.start && year <= gen.end) {
      return language === "bn" ? gen.bn : gen.name
    }
  }
  return language === "bn" ? "অজানা" : "Unknown"
}

function calculateAge(birthDate: Date, language: string): AgeResult {
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

  const timeDiff = today.getTime() - birth.getTime()
  const totalSeconds = Math.floor(timeDiff / 1000)
  const totalMinutes = Math.floor(timeDiff / (1000 * 60))
  const totalHours = Math.floor(timeDiff / (1000 * 60 * 60))
  const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)

  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate(), language)
  const chinese = getChineseZodiac(birth.getFullYear(), language)
  const generation = getGeneration(birth.getFullYear(), language)

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
    zodiacSign: zodiac.name,
    zodiacSymbol: zodiac.symbol,
    chineseZodiac: chinese.name,
    chineseSymbol: chinese.symbol,
    generation,
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

  useEffect(() => {
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
  }, [value, delay])

  return (
    <div
      className="bg-muted/30 rounded-2xl p-5 text-center border border-border/50 transition-all duration-500 hover:shadow-lg hover:scale-[1.02]"
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
  const { t, language } = useLanguage()
  const [birthDate, setBirthDate] = useState<string>("")
  const [result, setResult] = useState<AgeResult | null>(null)
  const [liveSeconds, setLiveSeconds] = useState<number>(0)
  const [hasCalculated, setHasCalculated] = useState(false)

  // Live seconds counter
  useEffect(() => {
    if (!birthDate || !result) return

    const interval = setInterval(() => {
      const birth = new Date(birthDate)
      const now = new Date()
      const diff = Math.floor((now.getTime() - birth.getTime()) / 1000)
      setLiveSeconds(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [birthDate, result])

  const handleCalculate = () => {
    if (!birthDate) return

    const date = new Date(birthDate)
    const today = new Date()

    if (date > today) return

    setResult(null)
    setTimeout(() => {
      setResult(calculateAge(date, language))
      setHasCalculated(true)
    }, 50)
  }

  const isFormValid = birthDate !== "" && new Date(birthDate) <= new Date()

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Input Card */}
      <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 space-y-6 border border-border/50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("ageCalculator")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "bn" 
              ? "আপনার সঠিক বয়স বছর, মাস এবং দিনে গণনা করুন" 
              : "Calculate your exact age in years, months, and days"}
          </p>
        </div>

        {/* Date of Birth Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t("dateOfBirth")}</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
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
          {hasCalculated ? t("calculate") : t("calculate")}
        </button>
      </div>

      {/* Result Card */}
      <div className="bg-card rounded-3xl shadow-xl shadow-black/5 p-6 border border-border/50">
        {result ? (
          <>
            {/* Main Age Display */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <ResultCard value={result.years} label={t("years")} color="#22C55E" delay={0} />
              <ResultCard value={result.months} label={t("months")} color="#3B82F6" delay={100} />
              <ResultCard value={result.days} label={t("days")} color="#F97316" delay={200} />
            </div>

            {/* Zodiac & Generation Info */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                <span className="text-xs text-purple-600 dark:text-purple-400 block mb-1">{t("zodiacSign")}</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{result.zodiacSign}</span>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                <span className="text-xs text-red-600 dark:text-red-400 block mb-1">{t("chineseZodiac")}</span>
                <span className="text-lg">{result.chineseSymbol}</span>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 block">{result.chineseZodiac}</span>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-center">
                <span className="text-xs text-cyan-600 dark:text-cyan-400 block mb-1">{t("generation")}</span>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{result.generation}</span>
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">{t("totalWeeks")}</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalWeeks.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">{t("totalDays")}</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalDays.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">{t("totalHours")}</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalHours.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                <span className="text-xs text-muted-foreground">{t("totalMinutes")}</span>
                <span className="text-sm font-bold text-foreground">
                  {result.totalMinutes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Live Seconds Counter */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 mb-4">
              <div className="text-center">
                <span className="text-xs text-muted-foreground block mb-1">{t("totalSeconds")}</span>
                <span className="text-2xl font-bold text-primary font-mono">
                  {liveSeconds.toLocaleString()}
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
                <span className="text-sm text-muted-foreground">{t("nextBirthday")}</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                {result.nextBirthday === 0 ? t("today") : `${result.nextBirthday} ${t("daysText")}`}
              </span>
            </div>
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
              {language === "bn" 
                ? "আপনার জন্ম তারিখ নির্বাচন করুন এবং হিসাব করুন ক্লিক করুন" 
                : "Select your date of birth and click Calculate to see your age"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
