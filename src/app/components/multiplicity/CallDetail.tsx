import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, AlertCircle, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";

interface CallDetailProps {
  callId: number;
  onBack: () => void;
  onCompare: () => void;
}

export function CallDetail({ callId, onBack, onCompare }: CallDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // Define all calls data
  const callsData = [
    {
      id: 1,
      rep: "Emma Rodriguez",
      customer: "David Kim",
      type: "🔎 Discovery",
      date: "Jan 20, 2026 at 4:00 PM",
      duration: "18:00",
      overallScore: 88,
      talkRatio: { rep: 55, customer: 45 },
      keyMoments: [
        { time: "1:15", label: "Discovery Phase" },
        { time: "4:30", label: "Pain Point Identified" },
        { time: "7:00", label: "Next Steps Set" },
      ],
      aiInsights: [
        {
          timestamp: "1:20",
          type: "positive",
          text: "Excellent active listening - paraphrased customer's concerns effectively",
        },
        {
          timestamp: "4:45",
          type: "positive",
          text: "Strong discovery question: 'How is this impacting your team's productivity?'",
        },
        {
          timestamp: "6:30",
          type: "improvement",
          text: "Could have probed deeper on budget allocation for Q2",
        },
      ],
      dimensions: [
        { name: "Discovery", score: 92 },
        { name: "Qualification", score: 88 },
        { name: "Objection Handling", score: 85 },
        { name: "Closing", score: 82 },
        { name: "Rapport Building", score: 90 },
      ],
      strengths: [
        "Excellent active listening and empathy",
        "Strong discovery questioning technique",
        "Built rapport quickly with technical stakeholder",
      ],
      improvements: [
        "Dig deeper on budget and timeline",
        "Identify additional stakeholders earlier",
      ],
      summary: "Emma demonstrated excellent discovery skills and built strong rapport with the technical stakeholder.",
    },
    {
      id: 2,
      rep: "Sarah Johnson",
      customer: "Michael Chen",
      type: "🎯 Demo",
      date: "Jan 20, 2026 at 10:00 AM",
      duration: "22:00",
      overallScore: 85,
      talkRatio: { rep: 65, customer: 35 },
      keyMoments: [
        { time: "3:20", label: "Discovery Phase" },
        { time: "8:15", label: "Objection Handled" },
        { time: "13:40", label: "Demo Scheduled" },
      ],
      aiInsights: [
        {
          timestamp: "3:15",
          type: "positive",
          text: "Great open-ended question: 'What challenges are you facing with your current solution?'",
        },
        {
          timestamp: "8:45",
          type: "positive",
          text: "Excellent objection handling using ROI data to address pricing concern",
        },
        {
          timestamp: "12:20",
          type: "improvement",
          text: "Missed opportunity to create urgency - could mention limited Q1 pricing",
        },
      ],
      dimensions: [
        { name: "Discovery", score: 85 },
        { name: "Qualification", score: 82 },
        { name: "Objection Handling", score: 90 },
        { name: "Closing", score: 78 },
        { name: "Rapport Building", score: 88 },
      ],
      strengths: [
        "Strong questioning technique in discovery",
        "Confident product knowledge",
        "Excellent rapport with C-level stakeholder",
      ],
      improvements: [
        "Add urgency in closing",
        "Reduce talk-time ratio (currently 65/35)",
      ],
      summary: "Sarah did an excellent job in understanding the customer's needs and establishing a strong rapport.",
    },
    {
      id: 3,
      rep: "Tom Martinez",
      customer: "Jennifer Wu",
      type: "📞 Outbound",
      date: "Jan 20, 2026 at 2:30 PM",
      duration: "11:00",
      overallScore: 52,
      talkRatio: { rep: 75, customer: 25 },
      keyMoments: [
        { time: "1:00", label: "Introduction" },
        { time: "3:30", label: "Objection Raised" },
        { time: "5:45", label: "Follow-up Scheduled" },
      ],
      aiInsights: [
        {
          timestamp: "1:20",
          type: "improvement",
          text: "Opening could be more engaging - consider starting with a provocative insight",
        },
        {
          timestamp: "3:45",
          type: "negative",
          text: "Handled objection defensively - missed opportunity to pivot to value proposition",
        },
        {
          timestamp: "5:10",
          type: "positive",
          text: "Good persistence in securing follow-up meeting",
        },
      ],
      dimensions: [
        { name: "Discovery", score: 45 },
        { name: "Qualification", score: 38 },
        { name: "Objection Handling", score: 55 },
        { name: "Closing", score: 42 },
        { name: "Rapport Building", score: 80 },
      ],
      strengths: [
        "Good initial rapport building",
        "Professional tone maintained",
      ],
      improvements: [
        "Improve discovery questioning",
        "Better objection handling needed",
        "Work on qualification skills",
        "Reduce talk-time ratio significantly",
      ],
      summary: "Tom showed good persistence but needs significant improvement in discovery and objection handling techniques.",
    },
  ];

  const call = callsData.find(c => c.id === callId) || callsData[0];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // Convert duration string (MM:SS) to seconds
  const parseDuration = (duration: string): number => {
    const [mins, secs] = duration.split(':').map(Number);
    return mins * 60 + secs;
  };

  const callDuration = parseDuration(call.duration);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(callDuration, currentTime + 10));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calls
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Call Analysis</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {call.rep} → {call.customer} • {call.type} • {call.date}
            </p>
          </div>
          <Button onClick={onCompare} className="bg-blue-600 hover:bg-blue-700 text-white">
            Compare with Another Call
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Overall Score + AI Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className={`border p-8 flex items-center justify-center ${getScoreBg(call.overallScore)}`}>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Overall Score</p>
              <div className={`text-6xl font-bold ${getScoreColor(call.overallScore)}`}>
                {call.overallScore}
              </div>
              <div className="text-2xl text-gray-500">/100</div>
            </div>
          </Card>

          <Card className="md:col-span-2 bg-white border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🌟 Excellent Execution</h3>
                <p className="text-gray-700 leading-relaxed">
                  {call.summary}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Dimensions */}
        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Dimensions</h2>
          <div className="space-y-5">
            {call.dimensions.map((dimension, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{dimension.name}</span>
                  <span className={`text-xl font-bold ${getScoreColor(dimension.score)}`}>
                    {dimension.score}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(dimension.score)} transition-all duration-500`}
                    style={{ width: `${dimension.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audio Player */}
        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Recording</h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4 mb-3">
              <Button
                onClick={handleSkipBack}
                size="sm"
                variant="outline"
                className="border-gray-300"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                onClick={handlePlayPause}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-10 h-10"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button
                onClick={handleSkipForward}
                size="sm"
                variant="outline"
                className="border-gray-300"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-600 font-medium">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={callDuration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-gray-500">{formatTime(callDuration)}</span>
                </div>
              </div>
              <Volume2 className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Key Moments */}
            <div className="flex items-center gap-2 flex-wrap mt-3">
              {call.keyMoments.map((moment, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-blue-300 text-blue-700">
                  {moment.time} - {moment.label}
                </Badge>
              ))}
            </div>

            {/* Talk Ratio */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Talk Ratio</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-600">Rep {call.talkRatio.rep}%</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-600">Customer {call.talkRatio.customer}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-600 h-full" 
                  style={{ width: `${call.talkRatio.rep}%` }}
                />
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${call.talkRatio.customer}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* AI Insights Timeline */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Real-Time Insights</h3>
              <p className="text-xs text-gray-600">Key moments and coaching opportunities identified during the call</p>
            </div>
          </div>
          <div className="space-y-3">
            {call.aiInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border-l-4 ${
                  insight.type === 'positive' 
                    ? 'bg-emerald-50 border-emerald-500' 
                    : insight.type === 'improvement'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 mt-0.5">
                    {insight.timestamp}
                  </Badge>
                  <p className="text-sm text-gray-700 flex-1">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Coaching Feedback */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Coaching Feedback</h3>
              <p className="text-gray-700 leading-relaxed">
                {call.rep} demonstrated excellent discovery skills by asking probing questions about the customer's pain points. 
                She effectively handled objections with data-driven responses. To improve: create more urgency in closing.
              </p>
            </div>
          </div>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">AI-Detected Strengths</h3>
            </div>
            <ul className="space-y-3">
              {call.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-600 text-lg flex-shrink-0">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Improvement Areas */}
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">AI Improvement Areas</h3>
            </div>
            <ul className="space-y-3">
              {call.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 text-lg flex-shrink-0">•</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}