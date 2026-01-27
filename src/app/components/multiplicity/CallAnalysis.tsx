import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Target, AlertTriangle } from "lucide-react";

interface CallAnalysisProps {
  onBack: () => void;
}

export function CallAnalysis({ onBack }: CallAnalysisProps) {
  // Executive Summary
  const summary = {
    score: 92,
    verdict: "Strong Discovery with Champion Engagement",
    summary: "Successfully taught new insight about ROI calculation. Champion identified and engaged. MEDDICC coverage at 71% - missing Economic Buyer identification and full Decision Process mapping.",
  };

  // Scorecard
  const challengerScores = [
    { skill: "Teach", emoji: "🎓", score: 95, comment: "Taught compelling insight about hidden costs in current process" },
    { skill: "Tailor", emoji: "✂️", score: 88, comment: "Adapted message to stakeholder's role and concerns" },
    { skill: "Take Control", emoji: "🎯", score: 90, comment: "Guided conversation toward next steps with confidence" },
  ];

  const meddiccScores = [
    { criteria: "Metrics", emoji: "📊", score: 85, status: "strong", comment: "$2.4M annual impact quantified" },
    { criteria: "Economic Buyer", emoji: "👔", score: 30, status: "gap", comment: "Not yet identified - CFO involvement unclear" },
    { criteria: "Decision Criteria", emoji: "✓", score: 75, status: "partial", comment: "3 of 5 criteria discovered" },
    { criteria: "Decision Process", emoji: "⚙️", score: 60, status: "partial", comment: "Timeline known, approval chain incomplete" },
    { criteria: "Identify Pain", emoji: "🎯", score: 95, status: "strong", comment: "Critical pain identified: manual reconciliation taking 40hrs/week" },
    { criteria: "Champion", emoji: "👑", score: 90, status: "strong", comment: "VP Operations confirmed as champion, actively selling internally" },
    { criteria: "Competition", emoji: "⚔️", score: 70, status: "partial", comment: "Aware of incumbent solution, no active evaluation" },
  ];

  // Refining Fire Moment
  const firemoment = {
    timestamp: "14:32",
    quote: "So if I'm hearing you correctly, your team is spending 40 hours a week on manual reconciliation. That's essentially a full-time employee just fixing errors. What if you could redeploy that person to strategic analysis instead?",
    impact: "Reframed the problem from 'tool replacement' to 'strategic capacity unlock' - changed prospect's perspective",
  };

  // Coaching (max 3)
  const coaching = [
    {
      type: "strength",
      title: "Excellent Reframing",
      detail: "Shifted conversation from features to business impact in first 8 minutes",
    },
    {
      type: "improve",
      title: "Identify Economic Buyer Next",
      detail: "Champion is engaged, but need CFO involvement before proposal - ask champion for introduction",
    },
    {
      type: "improve",
      title: "Map Full Decision Process",
      detail: "Timeline is known (Q1), but approval chain unclear - get org chart from champion",
    },
  ];

  // Next Best Action
  const nextAction = {
    action: "Send champion email template for CFO introduction",
    why: "Economic Buyer gap is highest risk to close - address within 48 hours",
    template: "Draft available in Agent",
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (score >= 60) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-pink-500";
  };

  const getStatusBadge = (status: string) => {
    if (status === "strong") return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Strong</Badge>;
    if (status === "gap") return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">Gap</Badge>;
    return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Partial</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-r from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-white/5 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Multiplicity Agent Analysis</h1>
              <p className="text-sm text-gray-400">Acme Corp - Discovery Call</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Executive Summary */}
        <Card className="bg-[#12121a] border-white/10 p-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 rounded-3xl border-4 bg-emerald-500/10 border-emerald-500/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-400">{summary.score}</div>
                <div className="text-xs text-gray-500">/100</div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{summary.verdict}</h2>
              <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
            </div>
          </div>
        </Card>

        {/* Scorecard - Challenger */}
        <Card className="bg-[#12121a] border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Challenger Scorecard</h3>
          <div className="space-y-5">
            {challengerScores.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-lg font-medium text-white">{item.skill}</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                </div>
                <div className="relative w-full h-2 bg-[#0a0a0f] rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute left-0 top-0 h-full ${getBarColor(item.score)} transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{item.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Scorecard - MEDDICC */}
        <Card className="bg-[#12121a] border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">MEDDICC Coverage</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {meddiccScores.map((item, index) => (
              <div key={index} className="p-5 rounded-xl bg-[#0a0a0f] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-base font-semibold text-white">{item.criteria}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className={`text-xl font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                  </div>
                </div>
                <div className="relative w-full h-1.5 bg-[#12121a] rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute left-0 top-0 h-full ${getBarColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{item.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Refining Fire Moment */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🔥</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">Refining Fire Moment</h3>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                {firemoment.timestamp}
              </Badge>
            </div>
          </div>
          <div className="bg-[#0a0a0f] border border-orange-500/20 rounded-xl p-6 mb-4">
            <p className="text-lg text-gray-200 italic leading-relaxed">"{firemoment.quote}"</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300">{firemoment.impact}</p>
          </div>
        </Card>

        {/* Coaching */}
        <Card className="bg-[#12121a] border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Coaching</h3>
          <div className="space-y-4">
            {coaching.map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border ${
                  item.type === "strength"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-yellow-500/5 border-yellow-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${item.type === "strength" ? "text-emerald-400" : "text-yellow-400"}`}>
                    {item.type === "strength" ? "✨" : "📈"}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-300">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Best Action */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Next Best Action</h3>
              <p className="text-xl text-white mb-2">{nextAction.action}</p>
              <p className="text-sm text-gray-300 mb-1">Why: {nextAction.why}</p>
              <p className="text-sm text-purple-400">{nextAction.template}</p>
              <div className="flex gap-3 mt-4">
                <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 text-white border-0">
                  Open Agent
                </Button>
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5">
                  View Template
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}