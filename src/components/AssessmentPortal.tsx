"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  CreditCard,
  Check
} from "lucide-react";

export function AssessmentPortal() {
  const [step, setStep] = useState<"account" | "test" | "score" | "checkout" | "done">("account");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    track: "Full-Stack Development (Next.js)",
  });

  const questions = [
    {
      q: "In modern JavaScript & TypeScript, what guarantees that a microtask (Promise callback) runs before the next macrotask (setTimeout)?",
      options: [
        "V8 event loop drains the microtask queue completely at the end of each task",
        "setTimeout has a mandatory 4ms browser throttle",
        "TypeScript compiles Promises into synchronous while loops"
      ],
      correct: 0
    },
    {
      q: "Why do Next.js Server Components improve Largest Contentful Paint (LCP)?",
      options: [
        "They execute on the server and stream ready HTML without sending component JS to the client",
        "They compress all images into base64 strings",
        "They cache all API payloads in client cookies"
      ],
      correct: 0
    },
    {
      q: "How does an atomic database transaction prevent double-spending in a payment checkout?",
      options: [
        "It locks or verifies balance condition within a single isolated ACID boundary",
        "It uses client-side debouncing on the pay button",
        "It writes transactions to a temporary JSON file"
      ],
      correct: 0
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [paying, setPaying] = useState(false);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setStep("test");
  };

  const handleAnswer = (optionIdx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQ] = optionIdx;
    setAnswers(nextAnswers);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      let count = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correct) count += 1;
      });
      const calculated = Math.round((count / questions.length) * 100);
      setScore(Math.max(calculated, 75));
      setStep("score");
    }
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep("done");
    }, 1000);
  };

  return (
    <section id="assessment" className="py-16 bg-slate-50/70 border-b border-border/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            Step 1 of Your Placement
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Skill Assessment &amp; Account Setup
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete the 3-minute diagnostic test to qualify for guaranteed HR interview calls.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-6 mb-6 border-b border-border">
            <span className={step === "account" ? "text-blue-600 font-bold" : ""}>1. Profile</span>
            <span className="text-slate-300">&rarr;</span>
            <span className={step === "test" ? "text-blue-600 font-bold" : ""}>2. Diagnostic Test</span>
            <span className="text-slate-300">&rarr;</span>
            <span className={step === "score" ? "text-blue-600 font-bold" : ""}>3. Scorecard</span>
            <span className="text-slate-300">&rarr;</span>
            <span className={step === "checkout" || step === "done" ? "text-blue-600 font-bold" : ""}>4. ₹5,000 Enrollment</span>
          </div>

          {/* STEP 1: ACCOUNT PROFILE */}
          {step === "account" && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Full Name</Label>
                  <Input
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Email Address</Label>
                  <Input
                    type="email"
                    required
                    placeholder="rahul@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">WhatsApp / Phone Number</Label>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">Target Skill Domain</Label>
                  <select
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Full-Stack Development (Next.js)">Full-Stack Next.js 15 (Avg ₹8.5L - ₹14L)</option>
                    <option value="Generative AI & Data Engineering">AI, LLMs &amp; Data Engineering (Avg ₹12L - ₹22L)</option>
                    <option value="Cloud Architecture & DevOps">Cloud DevOps &amp; Kubernetes (Avg ₹10L - ₹18L)</option>
                    <option value="Product UI/UX Design">Product UI/UX Design (Avg ₹7.5L - ₹12L)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-11 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25">
                  Start Technical Diagnostic Test &rarr;
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: TEST */}
          {step === "test" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
                <span className="font-bold text-blue-600">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  3-Min Test
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm font-medium text-blue-950">
                {questions[currentQ].q}
              </div>

              <div className="space-y-2">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl text-left border text-xs font-medium transition-all ${
                      answers[currentQ] === idx 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-card border-border hover:bg-slate-50 text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  disabled={answers[currentQ] === undefined}
                  onClick={handleNext}
                  className="text-xs font-semibold h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentQ < questions.length - 1 ? "Next Question &rarr;" : "Submit Test"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SCORECARD */}
          {step === "score" && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-bold shadow-sm">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Assessment Complete: {score}%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Congratulations <strong className="text-foreground">{formData.name}</strong>! You qualified for direct HR placement representation in <strong className="text-blue-600">{formData.track}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-secondary/70 border border-border text-left text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Placement Status:</span>
                  <span className="text-emerald-600 font-bold">Eligible for Guaranteed Interview Calls</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Assigned Course Fee:</span>
                  <span className="font-bold text-foreground">₹5,000 INR (Flat One-Time)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Partner Agencies Network:</span>
                  <span className="font-medium text-foreground">450+ Accredited HR Agencies</span>
                </div>
              </div>

              <Button onClick={() => setStep("checkout")} className="w-full text-xs font-semibold h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25">
                Enroll for ₹5,000 INR &amp; Secure Placement Track &rarr;
              </Button>
            </div>
          )}

          {/* STEP 4: CHECKOUT */}
          {step === "checkout" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-foreground">Confirm Course Enrollment</h3>
                  <p className="text-xs text-muted-foreground">{formData.track}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">₹5,000</div>
                  <div className="text-[10px] text-muted-foreground">One-time flat fee</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>100% Placement Interview Assurance:</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  You receive full curriculum access, mentor reviews, and guaranteed direct interview calls via our 450+ partner HR agencies upon capstone submission.
                </p>
              </div>

              <Button
                disabled={paying}
                onClick={handlePay}
                className="w-full h-11 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25"
              >
                {paying ? "Processing Enrollment..." : "Pay ₹5,000 INR & Activate Placement"}
              </Button>
            </div>
          )}

          {/* STEP 5: CONFIRMED */}
          {step === "done" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold shadow-sm">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Enrollment Confirmed!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Thank you, <strong className="text-foreground">{formData.name}</strong>. Your candidate placement profile has been activated. Our team is contacting you via WhatsApp ({formData.phone}).
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep("account")} className="text-xs rounded-xl">
                  Back to Profile
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
