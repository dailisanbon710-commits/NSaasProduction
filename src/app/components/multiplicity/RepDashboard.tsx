import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, Zap, Target, ArrowRight } from "lucide-react";

interface Call {
  id: string;
  prospect: string;
  date: string;
  time: string;
  score: number;
  riskLevel: "low" | "medium" | "high";
  outcome: string;
}

interface MultiplicityRepDashboardProps {
  onCallClick?: () => void;
}

export function MultiplicityRepDashboard({ onCallClick }: MultiplicityRepDashboardProps) {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  // Multiplicity Score (Hero)
  const multiplicityScore = 87;
  const scoreChange = +5;

  // What Changed Since Last Call
  const changes = [
    { type: "improved", text: "Champion engagement increased 40%", icon: "👑" },
    { type: "risk", text: "Economic buyer not yet identified", icon: "👔" },
    { type: "win", text: "Successfully taught new insight on ROI", icon: "🎓" },
  ];

  // Next Best Action
  const nextAction = {
    priority: "high",
    action: "Schedule call with Economic Buyer before Friday",
    reason: "Decision timeline is compressed - competitor meeting scheduled next week",
  };

  // Recent Calls
  const recentCalls: Call[] = [
    { id: "1", prospect: "Acme Corp - Discovery", date: "Jan 20, 2026", time: "4:00 PM", score: 92, riskLevel: "low", outcome: "Demo Scheduled" },
    { id: "2", prospect: "TechStart Inc - Demo", date: "Jan 20, 2026", time: "10:00 AM", score: 78, riskLevel: "medium", outcome: "Follow-up Needed" },
    { id: "3", prospect: "Global Systems - Qualification", date: "Jan 20, 2026", time: "8:30 AM", score: 85, riskLevel: "low", outcome: "Advancing" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 70) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const getRiskBadge = (risk: string) => {
    if (risk === "low") return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Low Risk</Badge>;
    if (risk === "high") return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">High Risk</Badge>;
    return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Medium Risk</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-r from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Multiplicity</h1>
              <p className="text-sm text-gray-400">AI Sales Multiplier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Multiplicity Score (Hero) */}
        <Card className="bg-gradient-to-br from-[#667eea] to-[#764ba2] border-0 p-8 shadow-2xl shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm uppercase tracking-wide mb-2">Multiplicity Score</p>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-bold text-white">{multiplicityScore}</span>
                <div className="flex items-center gap-1 text-emerald-300">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-2xl font-semibold">+{scoreChange}</span>
                </div>
              </div>
              <p className="text-purple-100 mt-2">from last call</p>
            </div>
            <div className="text-right">
              <div className="w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/10">
                <div className="text-center">
                  <div className="text-5xl mb-1">🚀</div>
                  <p className="text-xs text-white font-semibold">Elite</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What Changed Since Last Call */}
        <Card className="bg-[#12121a] border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">What Changed Since Last Call</h3>
          </div>
          <div className="space-y-3">
            {changes.map((change, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  change.type === "improved"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : change.type === "risk"
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-purple-500/5 border-purple-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{change.icon}</span>
                  <p className="text-gray-200 flex-1">{change.text}</p>
                  {change.type === "improved" && <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {change.type === "risk" && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Best Action */}
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">Next Best Action</h3>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">High Priority</Badge>
              </div>
              <p className="text-lg text-white mb-2">{nextAction.action}</p>
              <p className="text-sm text-gray-300">{nextAction.reason}</p>
              <Button className="mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0">
                Take Action
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Calls */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-white">Recent Calls</h3>
            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <Card
                key={call.id}
                className="bg-[#12121a] border-white/10 p-5 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedCall(call);
                  if (onCallClick) onCallClick();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{call.prospect}</h4>
                      {getRiskBadge(call.riskLevel)}
                      <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                        {call.outcome}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {call.date} at {call.time}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center ${getScoreBg(call.score)}`}>
                      <div>
                        <div className={`text-2xl font-bold ${getScoreColor(call.score)}`}>{call.score}</div>
                        <div className="text-xs text-gray-500">/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}