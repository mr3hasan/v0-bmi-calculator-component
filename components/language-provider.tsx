"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "bn"

type Translations = {
  [key: string]: {
    en: string
    bn: string
  }
}

export const translations: Translations = {
  // Common
  calculate: { en: "Calculate", bn: "হিসাব করুন" },
  reset: { en: "Reset", bn: "রিসেট" },
  result: { en: "Result", bn: "ফলাফল" },
  
  // Tabs
  bmiCalculator: { en: "BMI", bn: "বিএমআই" },
  ageCalculator: { en: "Age", bn: "বয়স" },
  calorieCalculator: { en: "Calorie", bn: "ক্যালোরি" },
  idealWeight: { en: "Ideal Weight", bn: "আদর্শ ওজন" },
  bodyFat: { en: "Body Fat", bn: "বডি ফ্যাট" },
  waterIntake: { en: "Water", bn: "পানি" },
  pregnancy: { en: "Pregnancy", bn: "গর্ভাবস্থা" },
  
  // BMI
  age: { en: "Age", bn: "বয়স" },
  gender: { en: "Gender", bn: "লিঙ্গ" },
  male: { en: "Male", bn: "পুরুষ" },
  female: { en: "Female", bn: "মহিলা" },
  height: { en: "Height", bn: "উচ্চতা" },
  weight: { en: "Weight", bn: "ওজন" },
  feet: { en: "Feet", bn: "ফুট" },
  inches: { en: "Inches", bn: "ইঞ্চি" },
  kg: { en: "kg", bn: "কেজি" },
  yourBmi: { en: "Your BMI", bn: "আপনার বিএমআই" },
  underweight: { en: "Underweight", bn: "কম ওজন" },
  normal: { en: "Normal", bn: "স্বাভাবিক" },
  overweight: { en: "Overweight", bn: "অতিরিক্ত ওজন" },
  obese: { en: "Obese", bn: "স্থূল" },
  underweightDesc: { en: "You are underweight. Consider consulting a healthcare provider.", bn: "আপনার ওজন কম। একজন স্বাস্থ্য বিশেষজ্ঞের সাথে পরামর্শ করুন।" },
  normalDesc: { en: "Great! You are in a healthy weight range.", bn: "দারুণ! আপনি স্বাস্থ্যকর ওজনের সীমায় আছেন।" },
  overweightDesc: { en: "You are overweight. Consider a balanced diet and exercise.", bn: "আপনার ওজন বেশি। সুষম খাদ্য এবং ব্যায়ামের কথা ভাবুন।" },
  obeseDesc: { en: "You are in the obese range. Please consult a healthcare provider.", bn: "আপনি স্থূল সীমায় আছেন। অনুগ্রহ করে একজন স্বাস্থ্য বিশেষজ্ঞের সাথে পরামর্শ করুন।" },
  
  // Age
  dateOfBirth: { en: "Date of Birth", bn: "জন্ম তারিখ" },
  years: { en: "Years", bn: "বছর" },
  months: { en: "Months", bn: "মাস" },
  days: { en: "Days", bn: "দিন" },
  weeks: { en: "Weeks", bn: "সপ্তাহ" },
  hours: { en: "Hours", bn: "ঘন্টা" },
  minutes: { en: "Minutes", bn: "মিনিট" },
  seconds: { en: "Seconds", bn: "সেকেন্ড" },
  totalWeeks: { en: "Total Weeks", bn: "মোট সপ্তাহ" },
  totalDays: { en: "Total Days", bn: "মোট দিন" },
  totalHours: { en: "Total Hours", bn: "মোট ঘন্টা" },
  totalMinutes: { en: "Total Minutes", bn: "মোট মিনিট" },
  totalSeconds: { en: "Total Seconds Lived", bn: "মোট সেকেন্ড বেঁচে আছেন" },
  nextBirthday: { en: "Next Birthday In", bn: "পরবর্তী জন্মদিন" },
  today: { en: "Today!", bn: "আজ!" },
  daysText: { en: "days", bn: "দিন" },
  zodiacSign: { en: "Zodiac Sign", bn: "রাশি" },
  chineseZodiac: { en: "Chinese Zodiac", bn: "চীনা রাশি" },
  generation: { en: "Generation", bn: "প্রজন্ম" },
  
  // Calorie
  activityLevel: { en: "Activity Level", bn: "কার্যকলাপের মাত্রা" },
  sedentary: { en: "Sedentary", bn: "বসে থাকা" },
  lightlyActive: { en: "Lightly Active", bn: "হালকা সক্রিয়" },
  moderatelyActive: { en: "Moderately Active", bn: "মাঝারি সক্রিয়" },
  veryActive: { en: "Very Active", bn: "খুব সক্রিয়" },
  extraActive: { en: "Extra Active", bn: "অতিরিক্ত সক্রিয়" },
  dailyCalories: { en: "Daily Calories Needed", bn: "দৈনিক প্রয়োজনীয় ক্যালোরি" },
  bmr: { en: "BMR (Basal Metabolic Rate)", bn: "বিএমআর (বেসাল মেটাবলিক রেট)" },
  toMaintain: { en: "To Maintain", bn: "বজায় রাখতে" },
  toLose: { en: "To Lose Weight", bn: "ওজন কমাতে" },
  toGain: { en: "To Gain Weight", bn: "ওজন বাড়াতে" },
  calories: { en: "calories/day", bn: "ক্যালোরি/দিন" },
  
  // Ideal Weight
  idealWeightTitle: { en: "Your Ideal Weight Range", bn: "আপনার আদর্শ ওজনের সীমা" },
  robinson: { en: "Robinson", bn: "রবিনসন" },
  miller: { en: "Miller", bn: "মিলার" },
  devine: { en: "Devine", bn: "ডিভাইন" },
  hamwi: { en: "Hamwi", bn: "হামউই" },
  average: { en: "Average", bn: "গড়" },
  
  // Body Fat
  waist: { en: "Waist", bn: "কোমর" },
  neck: { en: "Neck", bn: "গলা" },
  hip: { en: "Hip (Women)", bn: "নিতম্ব (মহিলা)" },
  cm: { en: "cm", bn: "সেমি" },
  bodyFatPercentage: { en: "Body Fat Percentage", bn: "বডি ফ্যাট শতাংশ" },
  essential: { en: "Essential Fat", bn: "অপরিহার্য ফ্যাট" },
  athletes: { en: "Athletes", bn: "ক্রীড়াবিদ" },
  fitness: { en: "Fitness", bn: "ফিটনেস" },
  acceptable: { en: "Acceptable", bn: "গ্রহণযোগ্য" },
  obeseFat: { en: "Obese", bn: "স্থূল" },
  
  // Water
  waterIntakeTitle: { en: "Daily Water Intake", bn: "দৈনিক পানি গ্রহণ" },
  liters: { en: "liters", bn: "লিটার" },
  glasses: { en: "glasses", bn: "গ্লাস" },
  waterTip: { en: "Drink more if you exercise or in hot weather", bn: "ব্যায়াম করলে বা গরমে আরও বেশি পান করুন" },
  
  // Pregnancy
  lastPeriod: { en: "Last Period Date", bn: "শেষ মাসিকের তারিখ" },
  dueDate: { en: "Due Date", bn: "প্রসবের তারিখ" },
  currentWeek: { en: "Current Week", bn: "বর্তমান সপ্তাহ" },
  trimester: { en: "Trimester", bn: "ত্রৈমাসিক" },
  first: { en: "First", bn: "প্রথম" },
  second: { en: "Second", bn: "দ্বিতীয়" },
  third: { en: "Third", bn: "তৃতীয়" },
  daysRemaining: { en: "Days Remaining", bn: "বাকি দিন" },
  conception: { en: "Conception Date", bn: "গর্ভধারণের তারিখ" },
  
  // Theme
  lightMode: { en: "Light", bn: "লাইট" },
  darkMode: { en: "Dark", bn: "ডার্ক" },
  systemMode: { en: "System", bn: "সিস্টেম" },
  
  // History
  history: { en: "History", bn: "ইতিহাস" },
  noHistory: { en: "No records yet", bn: "এখনও কোনো রেকর্ড নেই" },
  clearHistory: { en: "Clear History", bn: "ইতিহাস মুছুন" },
  share: { en: "Share", bn: "শেয়ার" },
}

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: () => "",
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "health-calc-language",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored) {
      setLanguage(stored)
    }
  }, [storageKey])

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language] || translation.en || key
  }

  const value = {
    language,
    setLanguage: (lang: Language) => {
      localStorage.setItem(storageKey, lang)
      setLanguage(lang)
    },
    t,
  }

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)
  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}
