import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Home, Phone, TrendingUp, Users, Settings, Search, Bell, User, ChevronRight, Play, Calendar, Clock, Target, AlertTriangle, Sparkles } from "lucide-react";
import { CallDetail } from "./CallDetail";
import { CallComparison } from "./CallComparison";
import { TeamPerformance } from "./TeamPerformance";

export function MultiplicityApp() {
  const [activeNav, setActiveNav] = useState<"rep" | "manager">("rep");
  const [selectedView, setSelectedView] = useState<"dashboard" | "callDetail" | "comparison" | "teamPerformance">("dashboard");
  const [selectedCallId, setSelectedCallId] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - only show in dashboard view */}
      {selectedView === "dashboard" && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="font-bold text-gray-900">Multiplicity</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Views</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveNav("rep")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeNav === "rep"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Rep Dashboard
                </button>
                <button
                  onClick={() => setActiveNav("manager")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeNav === "manager"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Manager Dashboard
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">SC</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Sarah Chen</p>
                <p className="text-xs text-gray-500 truncate">{activeNav === "rep" ? "Sales Rep" : "Sales Manager"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeNav === "rep" ? "Rep Dashboard" : "Manager Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeNav === "rep" ? "Your performance overview" : "Team performance overview"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {selectedView === "dashboard" && (activeNav === "rep" ? <RepDashboardContent onViewCalls={() => setSelectedView("teamPerformance")} /> : <ManagerDashboardContent />)}
          {selectedView === "callDetail" && (
            <CallDetail 
              callId={selectedCallId}
              onBack={() => setSelectedView("teamPerformance")} 
              onCompare={() => setSelectedView("comparison")} 
            />
          )}
          {selectedView === "comparison" && (
            <CallComparison onBack={() => setSelectedView("teamPerformance")} />
          )}
          {selectedView === "teamPerformance" && (
            <div>
              <TeamPerformance onSelectCall={(id) => {
                setSelectedCallId(id);
                setSelectedView("callDetail");
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Rep Dashboard Content
function RepDashboardContent({ onViewCalls }: { onViewCalls: () => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Score Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">Multiplicity Score</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold">87</span>
              <div className="flex items-center gap-1 text-emerald-300">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xl font-semibold">+5</span>
              </div>
            </div>
            <p className="text-blue-100 mt-2">from last call</p>
          </div>
          <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <div className="text-center">
              <div className="text-5xl mb-1">🚀</div>
              <p className="text-xs text-white font-semibold">Elite</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Calls This Week</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500 mt-2">Avg score: 84</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-gray-900">68%</p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% vs team
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Deals</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500 mt-2">$1.2M pipeline</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* What Changed Since Last Call */}
      <Card className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">What Changed Since Last Call</h2>
        </div>
        <div className="grid gap-3">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👑</span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Champion engagement increased 40%</p>
                <p className="text-sm text-gray-600 mt-1">Strong buy-in from VP Operations</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👔</span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Economic buyer not yet identified</p>
                <p className="text-sm text-gray-600 mt-1">Need CFO involvement before proposal</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">Successfully taught new insight on ROI</p>
                <p className="text-sm text-gray-600 mt-1">Reframed from tool to strategic capacity</p>
              </div>
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Calls */}
      <Card className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
          <Button 
            variant="outline" 
            className="text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onViewCalls}
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { prospect: "Acme Corp", type: "Discovery", date: "Jan 20, 2026", time: "4:00 PM", score: 92, status: "success", risk: "low" },
            { prospect: "TechStart Inc", type: "Demo", date: "Jan 20, 2026", time: "10:00 AM", score: 78, status: "warning", risk: "medium" },
            { prospect: "Global Systems", type: "Qualification", date: "Jan 20, 2026", time: "8:30 AM", score: 85, status: "success", risk: "low" },
          ].map((call, index) => (
            <div
              key={index}
              onClick={onViewCalls}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{call.prospect}</p>
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                      {call.type}
                    </Badge>
                    {call.risk === "medium" && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                        Medium Risk
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {call.date} at {call.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-0.5">Score</p>
                  <p className={`text-2xl font-bold ${call.status === "success" ? "text-emerald-600" : "text-yellow-600"}`}>
                    {call.score}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <Play className="w-4 h-4 mr-1" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Dimensions */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenger Skills</h2>
          <div className="space-y-4">
            {[
              { skill: "Teach", score: 88, emoji: "🎓" },
              { skill: "Tailor", score: 85, emoji: "✂️" },
              { skill: "Take Control", score: 82, emoji: "🎯" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.score}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MEDDICC Coverage</h2>
          <div className="space-y-3">
            {[
              { criteria: "Metrics", score: 90, emoji: "📊" },
              { criteria: "Economic Buyer", score: 45, emoji: "👔" },
              { criteria: "Decision Criteria", score: 75, emoji: "✓" },
              { criteria: "Champion", score: 88, emoji: "👑" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-sm text-gray-700">{item.criteria}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Manager Dashboard Content
function ManagerDashboardContent() {
  const teamMembers = [
    { name: "David Lee", role: "Sales Rep", score: 91, calls: 55, winRate: 72, trend: "up", avatar: "DL" },
    { name: "Sarah Chen", role: "Sales Rep", score: 87, calls: 48, winRate: 68, trend: "up", avatar: "SC" },
    { name: "Mike Johnson", role: "Sales Rep", score: 82, calls: 52, winRate: 61, trend: "stable", avatar: "MJ" },
    { name: "Emma Wilson", role: "Sales Rep", score: 79, calls: 45, winRate: 58, trend: "down", avatar: "EW" },
    { name: "Lisa Brown", role: "Sales Rep", score: 76, calls: 41, winRate: 54, trend: "up", avatar: "LB" },
  ];

  const atRiskReps = teamMembers.filter(m => m.score < 80 || m.winRate < 60);
  const topPerformers = teamMembers.filter(m => m.score >= 85);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Team Overview Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Team Avg Score</p>
          <p className="text-3xl font-bold text-gray-900">83</p>
          <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +6% this month
          </p>
        </Card>
        <Card className="bg-white border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Calls</p>
          <p className="text-3xl font-bold text-gray-900">241</p>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
        </Card>
        <Card className="bg-white border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Team Win Rate</p>
          <p className="text-3xl font-bold text-gray-900">63%</p>
          <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +8% vs last month
          </p>
        </Card>
        <Card className="bg-white border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Active Deals</p>
          <p className="text-3xl font-bold text-gray-900">34</p>
          <p className="text-sm text-gray-500 mt-2">$4.8M pipeline</p>
        </Card>
      </div>

      {/* At-Risk Reps */}
      <Card className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">At-Risk Reps</h2>
          <Badge className="bg-red-100 text-red-700 text-xs">{atRiskReps.length}</Badge>
        </div>
        <div className="space-y-3">
          {atRiskReps.map((rep, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{rep.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{rep.name}</p>
                  <p className="text-sm text-gray-600">
                    {rep.score < 80 && "Low score"} {rep.score < 80 && rep.winRate < 60 && "• "} {rep.winRate < 60 && "Low win rate"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-xl font-bold text-red-600">{rep.score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Win Rate</p>
                  <p className="text-xl font-bold text-red-600">{rep.winRate}%</p>
                </div>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Coach
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performers */}
      <Card className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
          <Badge className="bg-emerald-100 text-emerald-700 text-xs">{topPerformers.length}</Badge>
        </div>
        <div className="space-y-3">
          {topPerformers.map((rep, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                  index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                  index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                  "bg-gradient-to-br from-orange-400 to-orange-600"
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{rep.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{rep.name}</p>
                  <p className="text-sm text-gray-600">{rep.calls} calls this month</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-xl font-bold text-emerald-600">{rep.score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Win Rate</p>
                  <p className="text-xl font-bold text-emerald-600">{rep.winRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Leaderboard */}
      <Card className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Team Leaderboard</h2>
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                  index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
                  index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                  index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                  "bg-gradient-to-br from-blue-500 to-purple-500"
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{member.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-xl font-bold text-gray-900">{member.score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Calls</p>
                  <p className="text-xl font-bold text-gray-900">{member.calls}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Win Rate</p>
                  <p className="text-xl font-bold text-emerald-600">{member.winRate}%</p>
                </div>
                <div className="w-20">
                  {member.trend === "up" && <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto" />}
                  {member.trend === "down" && <TrendingUp className="w-5 h-5 text-red-600 rotate-180 mx-auto" />}
                  {member.trend === "stable" && <div className="w-5 h-0.5 bg-gray-400 mx-auto" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Team Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                <span>Team MEDDICC coverage improved by 12% - Champion identification is strongest skill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Economic Buyer identification needs attention - only 45% average across team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Challenger "Teach" skills trending up - consider sharing David's approach in team meeting</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}