"use client";

import React from "react";
import { Building2, Users, TrendingUp, Clock, Award, ShieldAlert } from "lucide-react";

export function StatsBanner() {
  const stats = [
    {
      label: "Accredited HR Agencies",
      value: "450+",
      subtext: "Actively headhunting our graduates",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
    },
    {
      label: "Graduate Placement Rate",
      value: "94.6%",
      subtext: "Within 90 days of graduation",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
    },
    {
      label: "Average Offer Package",
      value: "$78,500",
      subtext: "Reaching $115k+ in AI & Cloud",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
    },
    {
      label: "Average Time to Offer",
      value: "28 Days",
      subtext: "Via fast-track agency pipeline",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400"
    }
  ];

  return (
    <section className="py-12 bg-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-primary/30 transition-all hover:shadow-sm"
              >
                <div className={`p-2.5 rounded-xl ${stat.color} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
