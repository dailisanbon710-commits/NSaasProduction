import { X, Play, ChevronDown, TrendingUp, TrendingDown, Phone, Clock, Calendar } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { useState } from "react";

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

interface CallDetailViewProps {
  call: Call;
  onClose: () => void;
}

interface CategoryScore {
  name: string;
  score: number;
  feedback: string;
}

export function CallDetailView({ call, onClose }: CallDetailViewProps) {
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);

  // Mock data - in real app this would come from API based on call.id
  const callData = {
    title: call.title,
    repName: "Sarah Martinez",
    date: call.date,
    time: call.time,
    duration: call.duration,
    overallScore: call.score,
    prospect: call.prospect,
    outcome: call.outcome,
    riskLevel: call.riskLevel,
    summary: "Excellent discovery call with strong qualification and needs analysis. Rep demonstrated deep product knowledge and successfully booked a technical demo for next week. Minor opportunity to strengthen closing technique.",
  };

  const categoryScores: CategoryScore[] = [
    { 
      name: "Discovery", 
      score: 95, 
      feedback: "Outstanding questioning technique. Asked 14 open-ended questions covering budget, timeline, and decision process. Uncovered 3 key pain points early in conversation." 
    },
    { 
      name: "Qualification", 
      score: 92, 
      feedback: "Strong BANT qualification. Confirmed budget range ($50K-75K), identified decision maker (CTO + VP Sales), and established timeline (Q1 implementation)." 
    },
    { 
      name: "Objection Handling", 
      score: 88, 
      feedback: "Handled pricing concerns effectively using ROI calculator. Addressed 'need to think about it' objection by scheduling immediate next step." 
    },
    { 
      name: "Closing", 
      score: 85, 
      feedback: "Successfully closed for demo. Could improve by attempting trial close earlier in conversation (around 15-minute mark instead of 20-minute mark)." 
    },
    { 
      name: "Rapport Building", 
      score: 94, 
      feedback: "Natural conversation flow. Found common ground discussing industry challenges. Active listening demonstrated through relevant follow-up questions." 
    },
  ];

  const strengths = [
    "Asked 40% more discovery questions than team average",
    "Perfect qualification coverage (100% BANT criteria)",
    "Strong value articulation using customer success stories",
    "Excellent call control and time management"
  ];

  const improvements = [
    "Attempt trial close earlier (15-min mark vs 20-min)",
    "Reference specific ROI metrics more frequently (3x vs 1x)",
    "Reduce feature explanation time by 25% to focus on outcomes"
  ];

  const nextActions = [
    "Before demo: Send case study from similar company in their industry",
    "Prepare custom ROI analysis based on pain points discussed",
    "Include technical team member for product deep-dive",
    "Set agenda emphasizing integration capabilities (key concern mentioned)"
  ];

  const transcript = `[00:00:12] Sarah: Hi, this is Sarah Martinez calling from Multiplicity. Am I speaking with John from Acme Corp?

[00:00:18] Prospect: Yes, this is John. Thanks for calling.

[00:00:21] Sarah: Great! Thanks for taking my call, John. I know your time is valuable, so I'll keep this brief. I saw on LinkedIn that Acme is expanding its sales team. I'm curious - how are you currently handling sales performance and coaching?

[00:00:35] Prospect: Well, we're growing fast. We went from 10 reps to 25 in the last quarter, and honestly, our managers are struggling to keep up with coaching everyone effectively.

[00:00:47] Sarah: That's a common challenge with rapid growth. When you say struggling to keep up - what does that look like day-to-day?

[Full transcript continues...]`;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskBadge = (risk: string) => {
    if (risk === "low") return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low Risk</Badge>;
    if (risk === "high") return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Risk</Badge>;
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium Risk</Badge>;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-[#0a0a0f] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-[#12121a] border-b border-gray-800 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl text-white">{callData.title}</h2>
              {getRiskBadge(callData.riskLevel)}
              <Badge variant="outline" className="border-gray-700 text-gray-300">
                {callData.outcome}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                  SM
                </div>
                <span>{callData.repName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {callData.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {callData.time}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {callData.duration}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Call Overview */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <div className="flex items-start gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Overall Score</p>
                <div className={`text-6xl ${getScoreColor(callData.overallScore)}`}>
                  {callData.overallScore}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+5 vs avg</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-white mb-2">Call Summary</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{callData.summary}</p>
              </div>
            </div>
          </Card>

          {/* Recording Placeholder */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Play Recording
              </Button>
              <div className="flex-1 h-2 bg-gray-700 rounded-full">
                <div className="w-0 h-full bg-blue-500 rounded-full" />
              </div>
              <span className="text-sm text-gray-400">0:00 / {callData.duration}</span>
            </div>
          </Card>

          {/* Category Scores */}
          <div>
            <h3 className="text-lg text-white mb-4">Performance by Category</h3>
            <div className="space-y-4">
              {categoryScores.map((category, index) => (
                <Card key={index} className="bg-[#12121a] border-gray-800 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-base text-white">{category.name}</h4>
                        <span className={`text-xl ${getScoreColor(category.score)}`}>
                          {category.score}
                        </span>
                      </div>
                      <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`absolute left-0 top-0 h-full ${getBarColor(category.score)} transition-all duration-300`}
                          style={{ width: `${category.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{category.feedback}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-[#12121a] border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-lg text-white">Key Strengths</h3>
              </div>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-300">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#12121a] border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg text-white">Improvement Areas</h3>
              </div>
              <div className="space-y-3">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-300">{improvement}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Coaching Recommendations */}
          <Card className="bg-[#12121a] border-gray-800 p-6">
            <h3 className="text-lg text-white mb-4">Next Best Actions</h3>
            <div className="space-y-3">
              {nextActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1a24] border border-gray-800">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-300">{action}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Transcript Preview */}
          <Card className="bg-[#12121a] border-gray-800">
            <button
              onClick={() => setTranscriptExpanded(!transcriptExpanded)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-[#1a1a24] transition-colors"
            >
              <h3 className="text-lg text-white">Call Transcript</h3>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${transcriptExpanded ? 'rotate-180' : ''}`} />
            </button>
            {transcriptExpanded && (
              <div className="px-6 pb-6">
                <div className="p-4 rounded-lg bg-[#1a1a24] border border-gray-800">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {transcript}
                  </pre>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}