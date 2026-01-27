import { TrendingUp, TrendingDown, Phone, Users, Target, AlertCircle, ArrowRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { CallDetailView } from "@/app/components/CallDetailView";
import { CallsListView } from "@/app/components/CallsListView";

interface Call {
  id: string;
  title: string;
  date: string;
  time: string;
  prospect: string;
  duration: string;
  score: number;
  outcome: string;
  riskLevel: "low" | "medium" | "high";
}

interface Insight {
  category: string;
  message: string;
  impact: "positive" | "neutral" | "negative";
}

export function RepDashboard() {
  const repName = "Sarah Martinez";
  const dateRange = "Last 30 Days";
  const performanceScore = 87;
  const previousScore = 82;
  const trend = performanceScore > previousScore ? "up" : "down";
  const trendValue = Math.abs(performanceScore - previousScore);

  const recentCalls: Call[] = [
    { id: "1", title: "Call with Acme Corp", date: "Jan 22", time: "4:00 PM", prospect: "Acme Corp", duration: "24:15", score: 92, outcome: "Meeting Booked", riskLevel: "low" },
    { id: "2", title: "Call with TechStart Inc", date: "Jan 22", time: "10:00 AM", prospect: "TechStart Inc", duration: "18:42", score: 88, outcome: "Follow-up", riskLevel: "medium" },
    { id: "3", title: "Call with Global Systems", date: "Jan 22", time: "8:30 AM", prospect: "Global Systems", duration: "31:20", score: 95, outcome: "Demo Scheduled", riskLevel: "low" },
    { id: "4", title: "Call with Innovate Labs", date: "Jan 21", time: "4:15 PM", prospect: "Innovate Labs", duration: "15:30", score: 78, outcome: "Not Interested", riskLevel: "high" },
    { id: "5", title: "Call with DataFlow Co", date: "Jan 21", time: "2:00 PM", prospect: "DataFlow Co", duration: "22:05", score: 85, outcome: "Meeting Booked", riskLevel: "low" },
  ];

  const strengths = [
    "Strong objection handling (+15% vs avg)",
    "Excellent discovery questions",
    "High energy and enthusiasm",
    "Effective use of social proof"
  ];

  const improvements = [
    "Close rate on first call (65% vs 80% target)",
    "Average call duration (20m vs 25m target)",
    "Follow-up scheduling conversion"
  ];

  const coachingInsights: Insight[] = [
    { category: "Urgency", message: "Missed opportunity to create urgency. Next time try saying, 'It sounds like based on your current initiatives getting a solution up and running sooner rather than later would be beneficial. We would love to help you do that, if we were able to offer Q1 pricing, would you feel comfortable moving forward by March 31st?'", impact: "neutral" },
    { category: "Discovery", message: "Your question-to-statement ratio improved 20% this week. Great job asking open-ended questions like 'What does success look like for your team in Q2?' Keep this momentum!", impact: "positive" },
    { category: "Trial Close", message: "Consider adding more trial closes throughout the conversation. Example: 'Based on what you've shared about your team's challenges, does our approach make sense so far?'", impact: "neutral" },
  ];

  const actionableSteps = [
    { title: "Review objection handling specific to booking the next meeting and trial closes", priority: "high", category: "Closing Technique" },
    { title: "Practice urgency creation scripts with time-bound offers", priority: "medium", category: "Pitch Quality" },
    { title: "Implement active listening cues: paraphrasing and confirmation questions", priority: "high", category: "Active Listening" }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/10 border-green-500/20";
    if (score >= 75) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDotColor = (score: number) => {
    if (score >= 90) return "bg-green-500 border-green-400";
    if (score >= 75) return "bg-yellow-500 border-yellow-400";
    return "bg-red-500 border-red-400";
  };

  const performanceDimensions = [
    { name: "Discovery Questions", score: 92, target: 85 },
    { name: "Objection Handling", score: 88, target: 80 },
    { name: "Pitch Quality", score: 76, target: 85 },
    { name: "Closing Technique", score: 82, target: 80 },
    { name: "Rapport Building", score: 94, target: 85 },
    { name: "Active Listening", score: 68, target: 75 },
  ];

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider">Multiplicity Rep Performance Dashboard</div>
            <h1 className="text-3xl text-white mb-1">{repName}</h1>
            <p className="text-sm text-gray-400">{dateRange}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View All Calls
            </Button>
          </div>
        </div>

        {/* Performance Score */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Overall Performance Score</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl text-white">{performanceScore}</span>
                <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="text-xl">+{trendValue}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">vs previous period</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-2">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl text-white">42</p>
                <p className="text-xs text-gray-400">Calls</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 mb-2">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-2xl text-white">68%</p>
                <p className="text-xs text-gray-400">Connect Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl text-white">18</p>
                <p className="text-xs text-gray-400">Meetings</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Calls */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-white">Recent Calls</h3>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a24] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer" onClick={() => setSelectedCall(call)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm text-white">{call.prospect}</p>
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {call.outcome}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{call.date} • {call.time} • {call.duration}</p>
                  </div>
                  <div className={`text-xl ${getScoreColor(call.score)} flex items-center justify-center w-12 h-12 rounded-lg border ${getScoreBg(call.score)}`}>
                    {call.score}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Strengths and Improvements */}
          <div className="space-y-6">
            <Card className="bg-[#12121a] border-gray-800 p-6">
              <h3 className="text-lg text-white mb-4">Top Skills</h3>
              <div className="space-y-2">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-300">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#12121a] border-gray-800 p-6">
              <h3 className="text-lg text-white mb-4">Top Area of Opportunity</h3>
              <div className="space-y-2">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-300">{improvement}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Coaching Insights */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <h3 className="text-lg text-white mb-4">Key Coaching Insights</h3>
          <div className="grid grid-cols-3 gap-4">
            {coachingInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
                    {insight.category}
                  </Badge>
                  {insight.impact === "positive" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {insight.impact === "negative" && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {insight.impact === "neutral" && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                </div>
                <p className="text-sm text-gray-300">{insight.message}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Call Comparison Preview */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white">Call Performance Comparison</h3>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm">
              Deep Dive <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-gray-400">Win Rate</p>
                <div className="group relative">
                  <AlertCircle className="w-3 h-3 text-gray-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 z-10">
                    Calculated as: (Meetings Booked + Demos Scheduled) / Total Calls
                  </div>
                </div>
              </div>
              <p className="text-2xl text-white mb-1">43%</p>
              <p className="text-xs text-green-500">+8% vs last month</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Avg Call Duration</p>
              <p className="text-2xl text-white mb-1">21:30</p>
              <p className="text-xs text-yellow-500">-3:30 vs target</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Talk/Listen Ratio</p>
              <p className="text-2xl text-white mb-1">45/55</p>
              <p className="text-xs text-green-500">Optimal range</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Questions Asked</p>
              <p className="text-2xl text-white mb-1">12</p>
              <p className="text-xs text-green-500">+2 vs avg</p>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Closing Attempts</p>
              <p className="text-2xl text-white mb-1">3.2</p>
              <p className="text-xs text-gray-300">On target</p>
            </div>
          </div>
        </Card>

        {/* Actionable Next Steps */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <h3 className="text-lg text-white mb-4">Actionable Next Steps</h3>
          <div className="space-y-3">
            {actionableSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  step.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {step.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Dimensions */}
        <Card className="bg-[#12121a] border-gray-800 p-6">
          <h3 className="text-lg text-white mb-4">Performance Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            {performanceDimensions.map((dimension, index) => (
              <div key={index} className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white">{dimension.name}</p>
                  <span className={`text-lg ${getScoreColor(dimension.score)}`}>{dimension.score}</span>
                </div>
                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getBarColor(dimension.score)} transition-all duration-300`}
                    style={{ width: `${dimension.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">Target: {dimension.target}</p>
                  {dimension.score >= dimension.target ? (
                    <p className="text-xs text-green-500">+{dimension.score - dimension.target} above target</p>
                  ) : (
                    <p className="text-xs text-yellow-500">{dimension.target - dimension.score} below target</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Call Detail View */}
      {selectedCall && (
        <CallDetailView call={selectedCall} onClose={() => setSelectedCall(null)} />
      )}
    </div>
  );
}