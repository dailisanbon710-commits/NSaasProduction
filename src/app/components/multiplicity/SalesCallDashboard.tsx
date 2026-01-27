import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Phone, TrendingUp, TrendingDown, Minus, Trophy, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SalesCallDashboard() {
  const [selectedCallId, setSelectedCallId] = useState<number>(1);

  const calls = [
    {
      id: 1,
      rep: "Sarah Johnson",
      customer: "Michael Chen",
      type: "🎯 Demo",
      date: "Jan 20, 2026, 10:00 AM",
      score: 85,
      details: {
        summary: "🌟 Excellent Execution — Sarah did an excellent job in understanding the customer's needs and establishing a strong rapport.",
        dimensions: [
          { name: "Discovery", score: 85 },
          { name: "Qualification", score: 82 },
          { name: "Objection Handling", score: 90 },
          { name: "Closing", score: 78 },
          { name: "Rapport Building", score: 88 },
        ],
        coaching:
          "Sarah demonstrated excellent discovery skills by asking probing questions about the customer's pain points. She effectively handled objections with data-driven responses. To improve: create more urgency in closing.",
        strengths: [
          "Strong questioning technique",
          "Confident product knowledge",
          "Excellent rapport with C-level",
        ],
        improvements: [
          "Add urgency in closing",
          "Reduce talk-time ratio (currently 65/35)",
        ],
      },
    },
    {
      id: 2,
      rep: "Tom Martinez",
      customer: "Jennifer Wu",
      type: "📞 Outbound",
      date: "Jan 20, 2026, 10:00 AM",
      score: 52,
      details: {
        summary: "⚠️ Needs Improvement — Tom struggled with qualification and objection handling.",
        dimensions: [
          { name: "Discovery", score: 45 },
          { name: "Qualification", score: 38 },
          { name: "Objection Handling", score: 55 },
          { name: "Closing", score: 42 },
          { name: "Rapport Building", score: 80 },
        ],
        coaching:
          "Tom needs to work on discovery and qualification techniques. Good rapport building but must strengthen objection handling.",
        strengths: [
          "Good initial rapport",
          "Professional tone",
        ],
        improvements: [
          "Improve discovery questioning",
          "Better objection handling",
          "Work on qualification skills",
        ],
      },
    },
    {
      id: 3,
      rep: "Emma Rodriguez",
      customer: "David Kim",
      type: "🔎 Discovery",
      date: "Jan 20, 2026, 8:30 AM",
      score: 88,
      details: {
        summary: "🚀 Outstanding Performance — Emma excelled in all dimensions with strong discovery and qualification.",
        dimensions: [
          { name: "Discovery", score: 92 },
          { name: "Qualification", score: 87 },
          { name: "Objection Handling", score: 85 },
          { name: "Closing", score: 84 },
          { name: "Rapport Building", score: 92 },
        ],
        coaching:
          "Emma demonstrated excellent overall performance. Continue this momentum and share techniques with team.",
        strengths: [
          "Exceptional questioning",
          "Deep customer insights",
          "Natural relationship building",
        ],
        improvements: [
          "Maintain consistency",
        ],
      },
    },
  ];

  const teamPerformance = [
    {
      rank: 1,
      name: "Emma Rodriguez",
      score: 88,
      trend: "up",
      trendValue: 5,
      vsTeam: 10,
      chartData: [
        { call: 1, score: 78 },
        { call: 2, score: 80 },
        { call: 3, score: 83 },
        { call: 4, score: 88 },
      ],
    },
    {
      rank: 2,
      name: "Sarah Chen",
      score: 85,
      trend: "stable",
      trendValue: 0,
      vsTeam: 7,
      chartData: [
        { call: 1, score: 84 },
        { call: 2, score: 85 },
        { call: 3, score: 84 },
        { call: 4, score: 85 },
      ],
    },
    {
      rank: 3,
      name: "Tom Martinez",
      score: 52,
      trend: "down",
      trendValue: -8,
      vsTeam: -26,
      chartData: [
        { call: 1, score: 65 },
        { call: 2, score: 60 },
        { call: 3, score: 55 },
        { call: 4, score: 52 },
      ],
    },
  ];

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0];
  const sarah = calls[0];
  const tom = calls[1];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Improving (+{value})</span>
        </div>
      );
    }
    if (trend === "down") {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">Declining ({value})</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <Minus className="w-4 h-4" />
        <span className="text-sm font-medium">Stable</span>
      </div>
    );
  };

  const comparisons = [
    { name: "Discovery", sarah: sarah.details.dimensions[0].score, tom: tom.details.dimensions[0].score },
    { name: "Qualification", sarah: sarah.details.dimensions[1].score, tom: tom.details.dimensions[1].score },
    { name: "Objection Handling", sarah: sarah.details.dimensions[2].score, tom: tom.details.dimensions[2].score },
    { name: "Closing", sarah: sarah.details.dimensions[3].score, tom: tom.details.dimensions[3].score },
    { name: "Rapport", sarah: sarah.details.dimensions[4].score, tom: tom.details.dimensions[4].score },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-6">
        <h1 className="text-3xl font-bold mb-1">Multiplicity Rep Performance Dashboard</h1>
        <p className="text-purple-100">Real-Time Call Scoring & Coaching Insights</p>
      </div>

      <div className="p-8">
        {/* Top Section: Calls List + Call Detail */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Left: Calls List */}
          <div className="col-span-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Calls</h2>
            <div className="space-y-3">
              {calls.map((call) => (
                <Card
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedCallId === call.id
                      ? "border-purple-500 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{call.type}</span>
                        <p className="font-semibold text-gray-900">{call.rep}</p>
                      </div>
                      <p className="text-sm text-gray-600">Customer: {call.customer}</p>
                      <p className="text-xs text-gray-500 mt-1">{call.date}</p>
                    </div>
                    <div className="text-center ml-3">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${getScoreBg(
                          call.score
                        )}`}
                      >
                        <span className={`text-xl font-bold ${getScoreColor(call.score)}`}>
                          {call.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">/100</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Call Detail */}
          <div className="col-span-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Call Analysis</h2>
            <Card className="p-6 border-2 border-gray-200">
              {/* Header with Score */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center ${getScoreBg(
                    selectedCall.score
                  )} border-4 border-white shadow-lg`}
                >
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(selectedCall.score)}`}>
                      {selectedCall.score}
                    </div>
                    <div className="text-sm text-gray-600">/100</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCall.rep} → {selectedCall.customer}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {selectedCall.type} • {selectedCall.date}
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-gray-800">{selectedCall.details.summary}</p>
                  </div>
                </div>
              </div>

              {/* Performance Dimensions */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Dimensions</h4>
                <div className="space-y-3">
                  {selectedCall.details.dimensions.map((dim, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{dim.name}</span>
                        <span className={`text-lg font-bold ${getScoreColor(dim.score)}`}>
                          {dim.score}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(dim.score)} transition-all`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coaching Feedback */}
              <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Coaching Feedback</h4>
                    <p className="text-gray-700 text-sm">{selectedCall.details.coaching}</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedCall.details.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-emerald-600 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-gray-900">Areas to Improve</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedCall.details.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Team Performance + Compare */}
        <div className="grid grid-cols-2 gap-6">
          {/* Team Performance */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Team Performance</h2>
            <div className="space-y-3">
              {teamPerformance.map((member) => (
                <Card
                  key={member.rank}
                  className={`p-5 border-2 ${
                    member.score >= 80
                      ? "border-emerald-200 bg-emerald-50"
                      : member.score >= 60
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        member.rank === 1
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                          : member.rank === 2
                          ? "bg-gradient-to-br from-gray-300 to-gray-400"
                          : "bg-gradient-to-br from-orange-400 to-orange-600"
                      }`}
                    >
                      {member.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <div className={`text-3xl font-bold ${getScoreColor(member.score)}`}>
                          {member.score}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Trend:</span>
                          {getTrendIcon(member.trend, member.trendValue)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">vs Team Avg:</span>
                          <Badge
                            className={
                              member.vsTeam > 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {member.vsTeam > 0 ? "+" : ""}
                            {member.vsTeam}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-white/60 rounded p-2 border border-gray-200">
                        <ResponsiveContainer width="100%" height={50}>
                          <LineChart data={member.chartData}>
                            <XAxis dataKey="call" hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke={
                                member.score >= 80
                                  ? "#10b981"
                                  : member.score >= 60
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              strokeWidth={2}
                              dot={{
                                fill:
                                  member.score >= 80
                                    ? "#10b981"
                                    : member.score >= 60
                                    ? "#f59e0b"
                                    : "#ef4444",
                                r: 3,
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-center text-gray-500 mt-1">Last 4 calls trend</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Compare */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Compare Reps</h2>
            <Card className="p-6 border-2 border-gray-200">
              {/* Winner Banner */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-2xl font-bold">
                    {sarah.rep} by {sarah.score - tom.score} points
                  </span>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="space-y-3 mb-6">
                {comparisons.map((comp, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="text-sm font-medium text-gray-700 mb-2">{comp.name}</p>
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div
                        className={`text-center p-2 rounded ${
                          comp.sarah > comp.tom ? "bg-emerald-100 border border-emerald-300" : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`text-xl font-bold ${
                            comp.sarah > comp.tom ? "text-emerald-600" : "text-gray-600"
                          }`}
                        >
                          {comp.sarah}
                        </div>
                        <p className="text-xs text-gray-500">Sarah</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          +{comp.sarah - comp.tom}
                        </Badge>
                      </div>
                      <div
                        className={`text-center p-2 rounded ${
                          comp.tom > comp.sarah ? "bg-emerald-100 border border-emerald-300" : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`text-xl font-bold ${
                            comp.tom > comp.sarah ? "text-emerald-600" : "text-gray-600"
                          }`}
                        >
                          {comp.tom}
                        </div>
                        <p className="text-xs text-gray-500">Tom</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side by Side Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">{sarah.rep}</h4>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs">
                    <p className="font-medium text-emerald-800 mb-1">Strengths:</p>
                    <ul className="space-y-1">
                      {sarah.details.strengths.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs mt-2">
                    <p className="font-medium text-yellow-800 mb-1">Improvements:</p>
                    <ul className="space-y-1">
                      {sarah.details.improvements.map((s, i) => (
                        <li key={i} className="text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">{tom.rep}</h4>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs">
                    <p className="font-medium text-emerald-800 mb-1">Strengths:</p>
                    <ul className="space-y-1">
                      {tom.details.strengths.map((s, i) => (
                        <li key={i} className="text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs mt-2">
                    <p className="font-medium text-yellow-800 mb-1">Improvements:</p>
                    <ul className="space-y-1">
                      {tom.details.improvements.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}