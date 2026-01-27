import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";

interface Call {
  id: string;
  rep: string;
  customer: string;
  callType: string;
  emoji: string;
  date: string;
  time: string;
  score: number;
}

interface DimensionScore {
  name: string;
  emoji: string;
  score: number;
}

interface TeamMember {
  rank: number;
  name: string;
  score: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  vsAverage: number;
}

type View = "list" | "detail" | "team" | "comparison";

export function ModernDashboard() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const calls: Call[] = [
    { id: "1", rep: "Sarah Johnson", customer: "Michael Chen", callType: "Demo", emoji: "🎯", date: "Jan 20, 2026", time: "10:00 AM", score: 85 },
    { id: "2", rep: "Tom Martinez", customer: "Jennifer Wu", callType: "Outbound", emoji: "📞", date: "Jan 20, 2026", time: "2:30 PM", score: 52 },
    { id: "3", rep: "Emma Rodriguez", customer: "David Kim", callType: "Discovery", emoji: "🔎", date: "Jan 20, 2026", time: "4:00 PM", score: 88 },
  ];

  const sarahDimensions: DimensionScore[] = [
    { name: "Discovery", emoji: "🔍", score: 85 },
    { name: "Qualification", emoji: "✅", score: 82 },
    { name: "Objection Handling", emoji: "🛡️", score: 90 },
    { name: "Closing", emoji: "🎯", score: 78 },
    { name: "Rapport Building", emoji: "💬", score: 88 },
  ];

  const teamPerformance: TeamMember[] = [
    { rank: 1, name: "Emma Rodriguez", score: 88, trend: "up", trendValue: 5, vsAverage: 10 },
    { rank: 2, name: "Sarah Chen", score: 85, trend: "stable", trendValue: 0, vsAverage: 7 },
    { rank: 3, name: "Tom Martinez", score: 52, trend: "down", trendValue: 8, vsAverage: -26 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-cyan-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-cyan-500/10 border-cyan-500/30";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-cyan-400 to-blue-500";
    if (score >= 60) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-pink-500";
  };

  const handleCallClick = (call: Call) => {
    setSelectedCall(call);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedCall(null);
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1b3a] to-[#0a1628] border-b border-cyan-500/20 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          {currentView !== "list" && (
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="text-cyan-400 hover:bg-cyan-500/10 mb-4 border border-cyan-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calls
            </Button>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Multiplicity Rep Performance Dashboard</h1>
              <p className="text-cyan-400 text-lg">Real-Time Call Scoring & Coaching Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {currentView === "list" && (
          <div className="space-y-6">
            {/* View Switcher */}
            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentView("list")}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20"
              >
                Recent Calls
              </Button>
              <Button
                onClick={() => setCurrentView("team")}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-[#0d1b3a]"
              >
                Team Performance
              </Button>
              <Button
                onClick={() => setCurrentView("comparison")}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-[#0d1b3a]"
              >
                Compare Reps
              </Button>
            </div>

            {/* Call List */}
            <div className="grid gap-4">
              {calls.map((call) => (
                <Card
                  key={call.id}
                  className="bg-[#0d1b3a] border-cyan-500/20 p-6 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
                  onClick={() => handleCallClick(call)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                          <span className="text-2xl">{call.emoji}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{call.callType}</h3>
                          <p className="text-sm text-gray-400">
                            {call.rep} → {call.customer}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-cyan-400/70">{call.date} at {call.time}</p>
                    </div>
                    <div className="text-center">
                      <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center ${getScoreBg(call.score)} backdrop-blur-sm`}>
                        <div>
                          <div className={`text-3xl font-bold ${getScoreColor(call.score)}`}>{call.score}</div>
                          <div className="text-xs text-gray-500">/100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === "detail" && selectedCall && (
          <div className="space-y-6">
            {/* Call Overview */}
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <div className="flex items-start gap-8">
                <div className={`w-40 h-40 rounded-3xl border-4 flex items-center justify-center ${getScoreBg(selectedCall.score)} backdrop-blur-sm`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(selectedCall.score)}`}>{selectedCall.score}</div>
                    <div className="text-sm text-gray-500">/100</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-3xl">{selectedCall.emoji}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedCall.callType} Call</h2>
                      <p className="text-lg text-gray-400">{selectedCall.rep} → {selectedCall.customer}</p>
                    </div>
                  </div>
                  <p className="text-cyan-400/70 mb-4">{selectedCall.date} at {selectedCall.time}</p>
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-200 leading-relaxed">
                      <span className="text-2xl mr-2">🌟</span>
                      <strong className="text-cyan-400">Excellent Execution</strong> - Sarah did an excellent job in understanding the customer's needs
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Performance Dimensions */}
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Performance Dimensions</h3>
              <div className="space-y-5">
                {sarahDimensions.map((dimension, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dimension.emoji}</span>
                        <span className="text-lg font-medium text-gray-300">{dimension.name}</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                        {dimension.score}/100
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-[#0a1628] rounded-full overflow-hidden border border-cyan-500/10">
                      <div
                        className={`absolute left-0 top-0 h-full ${getBarColor(dimension.score)} transition-all duration-500`}
                        style={{ width: `${dimension.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Coaching Feedback */}
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Coaching Feedback</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Sarah demonstrated excellent discovery skills by asking probing questions about the customer's pain points. 
                She effectively handled objections with data-driven responses. To improve: Work on creating more urgency during the closing phase.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400 mt-1">●</span>
                      <span>Strong questioning technique during discovery</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400 mt-1">●</span>
                      <span>Confident product knowledge demonstration</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400 mt-1">●</span>
                      <span>Excellent rapport building with C-level stakeholder</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-yellow-400 mt-1">●</span>
                      <span>Add more urgency signals in closing</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-yellow-400 mt-1">●</span>
                      <span>Reduce talk time ratio (currently 65/35)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentView === "team" && (
          <div className="space-y-6">
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Team Performance Rankings</h3>
              <div className="space-y-4">
                {teamPerformance.map((member) => (
                  <div key={member.rank} className="flex items-center gap-6 p-5 rounded-xl bg-[#0a1628] border border-cyan-500/20">
                    <div className="text-4xl font-bold text-cyan-400 w-12">
                      #{member.rank}
                    </div>
                    <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center ${getScoreBg(member.score)} backdrop-blur-sm`}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(member.score)}`}>{member.score}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white">{member.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          {member.trend === "up" && <TrendingUp className="w-5 h-5 text-cyan-400" />}
                          {member.trend === "down" && <TrendingDown className="w-5 h-5 text-red-400" />}
                          {member.trend === "stable" && <Minus className="w-5 h-5 text-gray-400" />}
                          <span className={member.trend === "up" ? "text-cyan-400" : member.trend === "down" ? "text-red-400" : "text-gray-400"}>
                            {member.trend === "up" ? `Improving (+${member.trendValue})` : member.trend === "down" ? `Declining (-${member.trendValue})` : "Stable"}
                          </span>
                        </div>
                        <Badge className={member.vsAverage > 0 ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                          {member.vsAverage > 0 ? `+${member.vsAverage}` : member.vsAverage} vs Team Avg
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team Trends Chart Placeholder */}
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Team Performance Trends</h3>
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl border-2 border-dashed border-cyan-500/20">
                <div className="text-center">
                  <p className="text-lg text-gray-400 mb-2">📊 Performance Chart</p>
                  <p className="text-sm text-gray-500">Showing team trends over the last 30 days</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentView === "comparison" && (
          <div className="space-y-6">
            {/* Winner Banner */}
            <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 shadow-2xl shadow-cyan-500/20 border-0">
              <div className="text-center">
                <div className="text-6xl mb-2">🏆</div>
                <h2 className="text-3xl font-bold text-white">Sarah Chen by 33 points</h2>
              </div>
            </Card>

            {/* Comparison Table */}
            <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Dimension Comparison: Sarah Chen vs Tom Martinez</h3>
              <div className="space-y-4">
                {[
                  { name: "Discovery", emoji: "", sarah: 85, tom: 45 },
                  { name: "Qualification", emoji: "✅", sarah: 82, tom: 38 },
                  { name: "Objection Handling", emoji: "🛡️", sarah: 90, tom: 55 },
                  { name: "Closing", emoji: "🎯", sarah: 78, tom: 42 },
                  { name: "Rapport Building", emoji: "💬", sarah: 88, tom: 80 },
                ].map((dimension, index) => {
                  const diff = dimension.sarah - dimension.tom;
                  return (
                    <div key={index} className="p-4 rounded-xl bg-[#0a1628] border border-cyan-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{dimension.emoji}</span>
                          <span className="text-lg font-semibold text-gray-300">{dimension.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏆</span>
                          <span className="text-cyan-400 font-bold">Sarah (+{diff})</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Sarah Chen</span>
                            <span className={`font-bold ${getScoreColor(dimension.sarah)}`}>{dimension.sarah}</span>
                          </div>
                          <div className="relative w-full h-2 bg-[#0a1628] rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full ${getBarColor(dimension.sarah)}`}
                              style={{ width: `${dimension.sarah}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Tom Martinez</span>
                            <span className={`font-bold ${getScoreColor(dimension.tom)}`}>{dimension.tom}</span>
                          </div>
                          <div className="relative w-full h-2 bg-[#0a1628] rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full ${getBarColor(dimension.tom)}`}
                              style={{ width: `${dimension.tom}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-3xl border-4 bg-cyan-500/10 border-cyan-500/30 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-cyan-400">85</div>
                      <div className="text-xs text-gray-500">/100</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Sarah Chen</h3>
                  <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Top Performer</Badge>
                </div>
              </Card>
              <Card className="bg-[#0d1b3a] border-cyan-500/20 p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-3xl border-4 bg-red-500/10 border-red-500/30 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-400">52</div>
                      <div className="text-xs text-gray-500">/100</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Tom Martinez</h3>
                  <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">Needs Coaching</Badge>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}