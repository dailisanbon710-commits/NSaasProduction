import { TrendingUp, TrendingDown, AlertTriangle, Award, ArrowRight, Phone } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

interface Rep {
  id: string;
  name: string;
  score: number;
  trend: "up" | "down" | "flat";
  calls: number;
  meetings: number;
  status: "on-track" | "at-risk" | "excellent";
}

interface TeamInsight {
  title: string;
  description: string;
  type: "alert" | "success" | "info";
}

export function ManagerDashboard() {
  const teamAvgScore = 82;
  const previousAvgScore = 79;
  const trend = teamAvgScore > previousAvgScore ? "up" : "down";
  const trendValue = Math.abs(teamAvgScore - previousAvgScore);
  const dateRange = "Last 30 Days";

  const reps: Rep[] = [
    { id: "1", name: "Sarah Martinez", score: 87, trend: "up", calls: 42, meetings: 18, status: "excellent" },
    { id: "2", name: "Michael Chen", score: 84, trend: "up", calls: 38, meetings: 15, status: "on-track" },
    { id: "3", name: "Jessica Williams", score: 79, trend: "flat", calls: 35, meetings: 12, status: "on-track" },
    { id: "4", name: "David Rodriguez", score: 88, trend: "up", calls: 45, meetings: 21, status: "excellent" },
    { id: "5", name: "Emily Thompson", score: 72, trend: "down", calls: 28, meetings: 8, status: "at-risk" },
    { id: "6", name: "James Anderson", score: 81, trend: "up", calls: 40, meetings: 16, status: "on-track" },
    { id: "7", name: "Lisa Brown", score: 68, trend: "down", calls: 30, meetings: 9, status: "at-risk" },
    { id: "8", name: "Robert Taylor", score: 86, trend: "up", calls: 43, meetings: 19, status: "excellent" },
  ];

  const atRiskReps = reps.filter((rep) => rep.status === "at-risk");
  const topPerformers = reps.filter((rep) => rep.status === "excellent").sort((a, b) => b.score - a.score).slice(0, 3);

  const teamInsights: TeamInsight[] = [
    { title: "Peak Performance Hours", description: "Team converts 40% better between 10 AM - 12 PM. Consider scheduling key calls during this window.", type: "success" },
    { title: "Objection Handling Gap", description: "3 reps struggling with pricing objections. Group coaching session recommended.", type: "alert" },
    { title: "Call Volume Trend", description: "Team average up 15% this week. Maintain momentum with Friday motivation session.", type: "success" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-green-500/10 border-green-500/20";
    if (score >= 75) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getStatusBadge = (status: string) => {
    if (status === "excellent") return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Excellent</Badge>;
    if (status === "at-risk") return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">At Risk</Badge>;
    return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">On Track</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider">Multiplicity Manager Dashboard</div>
            <h1 className="text-3xl text-white mb-1">Team Performance</h1>
            <p className="text-sm text-gray-400">{dateRange}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Schedule Coaching
            </Button>
          </div>
        </div>

        {/* Team Average Score */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Team Average Score</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl text-white">{teamAvgScore}</span>
                <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="text-xl">+{trendValue}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">vs previous period</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-2">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl text-white">312</p>
                <p className="text-xs text-gray-400">Total Calls</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 mb-2">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-2xl text-white">118</p>
                <p className="text-xs text-gray-400">Meetings Set</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-2xl text-white">{atRiskReps.length}</p>
                <p className="text-xs text-gray-400">At Risk</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl text-white">68%</p>
                <p className="text-xs text-gray-400">Avg Connect</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* At-Risk Reps */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg text-white">At-Risk Reps</h3>
            </div>
            <div className="space-y-3">
              {atRiskReps.map((rep) => (
                <div key={rep.id} className="p-3 rounded-lg bg-[#1a1a24] border border-gray-800 hover:border-red-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-white">{rep.name}</p>
                    <div className={`text-lg ${getScoreColor(rep.score)} flex items-center justify-center w-10 h-10 rounded-lg border ${getScoreBg(rep.score)}`}>
                      {rep.score}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{rep.calls} calls</span>
                    <span>{rep.meetings} meetings</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>

          {/* Top Performers */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-green-500" />
              <h3 className="text-lg text-white">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.map((rep, index) => (
                <div key={rep.id} className="p-3 rounded-lg bg-[#1a1a24] border border-gray-800 hover:border-green-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs">
                        #{index + 1}
                      </div>
                      <p className="text-sm text-white">{rep.name}</p>
                    </div>
                    <div className={`text-lg ${getScoreColor(rep.score)} flex items-center justify-center w-10 h-10 rounded-lg border ${getScoreBg(rep.score)}`}>
                      {rep.score}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{rep.calls} calls</span>
                    <span>{rep.meetings} meetings</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>

          {/* Team Insights */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <h3 className="text-lg text-white mb-4">Recent Insights</h3>
            <div className="space-y-3">
              {teamInsights.map((insight, index) => (
                <div key={index} className="p-3 rounded-lg bg-[#1a1a24] border border-gray-800">
                  <div className="flex items-start gap-2">
                    {insight.type === "alert" && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                    {insight.type === "success" && <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
                    {insight.type === "info" && <div className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm text-white mb-1">{insight.title}</p>
                      <p className="text-xs text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rep List */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <h3 className="text-lg text-white mb-4">All Team Members</h3>
          <div className="space-y-2">
            {reps.map((rep) => (
              <div key={rep.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a24] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                    {rep.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-white">{rep.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>{rep.calls} calls</span>
                      <span>•</span>
                      <span>{rep.meetings} meetings</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(rep.status)}
                  <div className="flex items-center gap-2">
                    <div className={`text-xl ${getScoreColor(rep.score)} flex items-center justify-center w-12 h-12 rounded-lg border ${getScoreBg(rep.score)}`}>
                      {rep.score}
                    </div>
                    {rep.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {rep.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}