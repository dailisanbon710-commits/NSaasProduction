import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TeamPerformanceProps {
  onSelectCall: (callId: number) => void;
}

export function TeamPerformance({ onSelectCall }: TeamPerformanceProps) {
  const teamMembers = [
    {
      rank: 1,
      name: "Emma Rodriguez",
      customer: "David Kim",
      type: "🔎 Discovery",
      date: "Jan 20, 2026 at 4:00 PM",
      score: 88,
      trend: "up",
      trendValue: 5,
      vsAverage: 10,
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      customer: "Michael Chen",
      type: "🎯 Demo",
      date: "Jan 20, 2026 at 10:00 AM",
      score: 85,
      trend: "stable",
      trendValue: 0,
      vsAverage: 7,
    },
    {
      rank: 3,
      name: "Tom Martinez",
      customer: "Jennifer Wu",
      type: "📞 Outbound",
      date: "Jan 20, 2026 at 10:00 AM",
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <span className="text-white font-bold">1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-white font-bold">2</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <span className="text-white font-bold">{rank}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Team Performance Rankings</h2>
        <p className="text-sm text-gray-500">Click any call to view details</p>
      </div>
      
      {teamMembers.map((member) => (
        <Card 
          key={member.rank} 
          className={`border p-6 ${getScoreBg(member.score)} cursor-pointer hover:shadow-md transition-all`}
          onClick={() => onSelectCall(member.rank)}
        >
          <div className="flex items-start gap-6">
            {/* Rank Badge */}
            <div className="flex-shrink-0">{getRankBadge(member.rank)}</div>

            {/* Member Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">
                    {member.customer} • {member.type}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{member.date}</p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(member.score)}`}>
                    {member.score}
                  </div>
                  <div className="text-sm text-gray-500">/100</div>
                </div>
              </div>

              {/* Trend & vs Team */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Trend:</span>
                  {getTrendIcon(member.trend, member.trendValue)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">vs Team Avg:</span>
                  <Badge className={member.vsTeam > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                    {member.vsTeam > 0 ? "+" : ""}{member.vsTeam}
                  </Badge>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={member.chartData}>
                    <XAxis dataKey="call" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke={member.score >= 80 ? "#10b981" : member.score >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth={2}
                      dot={{ fill: member.score >= 80 ? "#10b981" : member.score >= 60 ? "#f59e0b" : "#ef4444", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-gray-500 mt-1">Last 4 calls</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}