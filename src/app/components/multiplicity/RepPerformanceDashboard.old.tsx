import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Trophy, Target, AlertTriangle, Sparkles, Calendar, Clock, User, Play, Pause, SkipBack, SkipForward, Volume2, FileText, ChevronDown, ArrowUpDown, Phone, Award, ExternalLink, CheckCircle2, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from "recharts";
import { useState } from "react";
import { AIChatPanel } from "./AIChatPanel";

export function RepPerformanceDashboard() {
  const [selectedCallId, setSelectedCallId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [callSortBy, setCallSortBy] = useState<"date" | "score" | "name">("date");
  const [scheduleSortBy, setScheduleSortBy] = useState<"date" | "name" | "type">("date");

  // Call data
  const calls = [
    {
      id: 1,
      rep: "Sarah Johnson",
      customer: "Michael Chen",
      company: "TechSolutions",
      industry: "Cloud Migration",
      type: "Demo",
      date: "Jan 20, 2026",
      time: "10:00 AM",
      duration: "22:00",
      score: 85,
      dimensions: {
        discovery: 85,
        qualification: 82,
        objectionHandling: 90,
        closing: 78,
        rapportBuilding: 88,
      },
      summary: "Excellent execution. Strong customer understanding and rapport building. Demo scheduled successfully.",
      coaching: "Sarah demonstrated excellent discovery skills by asking probing questions about the customer's pain points. She effectively handled objections with data-driven responses. To improve: create more urgency in closing.",
      outcome: "Demo Scheduled for Tuesday 2 PM",
      transcript: `Rep: Good morning, this is Sarah Johnson from TechSolutions. Am I speaking with Michael Chen?

Customer: Yes, that's me. Hi Sarah.

Rep: Great! Thanks for taking my call, Michael. I see you recently downloaded our whitepaper on cloud migration strategies. How's your company currently handling data storage?

Customer: We're using a mix of on-premise servers and some basic cloud storage. It's becoming a bit of a headache to manage, honestly.

Rep: I completely understand. Many of our clients were in a similar position before they switched. Can you tell me more about the specific challenges you're facing?

Customer: Well, our IT team spends a lot of time on maintenance, and we've had a couple of near-misses with data security. Plus, our costs keep climbing.

Rep: Those are exactly the pain points we help solve. Based on what you're telling me, it sounds like you have about 50-100 employees. Is that right?

Customer: Actually, we're closer to 200 now. We've grown pretty fast in the last year.

Rep: That's fantastic growth! Congratulations. With that size, you'd definitely benefit from our Enterprise plan. It includes 24/7 support, automated backups, and enterprise-grade security. May I ask, what's your timeline for making a decision on this?

Customer: We're hoping to have something in place by end of Q1. So about two months from now.

Rep: Perfect timing. Our implementation typically takes 3-4 weeks. I'd love to set up a demo for you and your IT lead next week. How does Tuesday or Wednesday look for you?

Customer: Tuesday could work. What time?

Rep: How about 2 PM EST? I'll send you a calendar invite with a custom demo link.

Customer: Sounds good, Sarah. I'll make sure our CTO joins as well.

Rep: Excellent! I'll also send over a couple of case studies from companies in your industry. Looking forward to showing you how we can solve those pain points. Have a great day, Michael!

Customer: Thanks, you too!`,
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
          text: "Missed opportunity to create urgency. Next time try saying, 'It sounds like based on your current initiatives getting a solution up and running sooner rather than later would be beneficial. We would love to help you do that, if we were able to offer Q1 pricing, would you feel comfortable moving forward by March 31st?'",
        },
      ],
      talkRatio: {
        rep: 65,
        customer: 35,
      },
      keyMoments: [
        { time: "3:20", label: "Discovery Phase" },
        { time: "8:15", label: "Objection Handled" },
        { time: "13:40", label: "Demo Scheduled" },
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
    },
    {
      id: 2,
      rep: "Tom",
      customer: "Jennifer Wu",
      company: "MarketPro",
      industry: "Marketing Automation",
      type: "Outbound",
      date: "Jan 20, 2026",
      time: "2:30 PM",
      duration: "11:00",
      score: 52,
      dimensions: {
        discovery: 45,
        qualification: 38,
        objectionHandling: 55,
        closing: 42,
        rapportBuilding: 80,
      },
      summary: "Needs improvement. Weak qualification and objection handling. Customer rejected and requested removal.",
      coaching: "Tom needs to focus on discovery techniques and qualification framework. Good rapport but needs stronger objection handling and better timing on pitch.",
      outcome: "Rejected - Removal Requested",
      transcript: `Rep: Hi, is this Jennifer?

Customer: Yes, who's calling?

Rep: This is Tom from MarketPro. I wanted to talk to you about our marketing automation software.

Customer: I'm actually pretty busy right now. Can you send me an email instead?

Rep: I understand you're busy, but this will only take a minute. We have a special promotion running this week—

Customer: Look, I really don't have time for a sales pitch right now.

Rep: I get it, but our software has helped hundreds of companies increase their ROI by up to 300%. Don't you want to hear how?

Customer: Not really. We already use a marketing platform and we're happy with it.

Rep: But have you considered the features we offer? We have AI-powered email campaigns, social media scheduling, and analytics dashboards. What platform are you using now?

Customer: I don't think I need to share that. I'm sorry, but I really need to go.

Rep: Wait, wait. What if I could get you a 20% discount? Our manager approved it for this week only.

Customer: I appreciate the offer, but I'm not interested. Please remove me from your call list.

Rep: Are you sure? This is a limited-time offer and—

Customer: Yes, I'm sure. Goodbye.`,
      aiInsights: [
        {
          timestamp: "1:20",
          type: "negative",
          text: "Started pitch too early - customer didn't show buying signals yet",
        },
        {
          timestamp: "3:45",
          type: "improvement",
          text: "Weak qualification - didn't ask about budget or decision timeline",
        },
        {
          timestamp: "5:10",
          type: "negative",
          text: "Struggled with pricing objection - became defensive instead of exploring concerns",
        },
      ],
      talkRatio: {
        rep: 75,
        customer: 25,
      },
      keyMoments: [
        { time: "1:00", label: "Early Pitch Attempt" },
        { time: "3:30", label: "Pricing Objection" },
        { time: "5:45", label: "Customer Rejection" },
      ],
      strengths: [
        "Good initial rapport building",
        "Enthusiastic tone",
      ],
      improvements: [
        "Improve discovery and qualification",
        "Better objection handling techniques",
        "Reduce talk-time ratio significantly",
        "Listen more before pitching",
      ],
    },
    {
      id: 3,
      rep: "Emma Rodriguez",
      customer: "David Kim",
      company: "FinanceHub",
      industry: "Financial Services",
      type: "Discovery",
      date: "Jan 20, 2026",
      time: "4:00 PM",
      duration: "18:00",
      score: 88,
      dimensions: {
        discovery: 92,
        qualification: 88,
        objectionHandling: 85,
        closing: 82,
        rapportBuilding: 90,
      },
      summary: "Outstanding discovery call. Excellent questioning and qualification. Customer requested proposal by Friday.",
      coaching: "Emma demonstrated exceptional discovery skills with deep probing questions. Strong qualification and rapport building. Customer is highly engaged and requested proposal.",
      outcome: "Proposal Requested by Friday",
      transcript: `Rep: Hello David, this is Emma Rodriguez from FinanceHub. Thanks for scheduling this call with me.

Customer: Hi Emma, yes, I've been looking into your platform for our accounting needs.

Rep: Wonderful! Before we dive in, I'd love to understand more about your current setup. What's working well, and what's not working so well with your current accounting system?

Customer: We're using QuickBooks right now. It's okay for basic stuff, but we struggle with multi-currency transactions since we work with international clients. Also, the reporting features are pretty limited.

Rep: Got it. So multi-currency support and advanced reporting are key priorities. How many international transactions would you say you process monthly?

Customer: Probably around 30-40 transactions across five different currencies.

Rep: That makes sense. Our platform handles that seamlessly with real-time exchange rates. On the reporting side, what specific reports would be most valuable to you?

Customer: We need cash flow forecasting, P&L by department, and ideally some custom dashboards for our board meetings.

Rep: All of that is included in our Professional tier. One thing I should mention—there is a learning curve for the advanced features. Would your team be open to a training session as part of the onboarding?

Customer: That would actually be really helpful. How long does onboarding usually take?

Rep: Typically 2-3 weeks with training. I won't sugarcoat it—the first month can be an adjustment period, but our clients consistently tell us it's worth it. We'd assign you a dedicated account manager to help with the transition.

Customer: What about pricing? I saw your website lists $299/month, but we're a small team of just 8 people.

Rep: For your size and needs, the Professional plan at $299 is the right fit. I don't have flexibility on the monthly rate, but I can offer you the first month free to give your team time to get comfortable with the platform. How does that sound?

Customer: That's fair. I think this could work for us. Can you send me a proposal with the implementation timeline?

Rep: Absolutely. I'll have that to you by tomorrow morning. And just to set expectations, the proposal will include the onboarding schedule, training sessions, and a direct line to your account manager. Sound good?

Customer: Perfect. I'll review it with my CFO and get back to you by Friday.

Rep: Great! I'll also include some client references in your industry. Thanks for your time today, David.

Customer: Thanks, Emma. Talk soon!`,
      aiInsights: [
        {
          timestamp: "0:45",
          type: "positive",
          text: "Perfect call opening - referenced previous conversation details",
        },
        {
          timestamp: "2:30",
          type: "positive",
          text: "Exceptional discovery question: 'What would success look like in 6 months?'",
        },
        {
          timestamp: "4:15",
          type: "positive",
          text: "Strong qualification - confirmed budget, timeline, and decision makers",
        },
      ],
      talkRatio: {
        rep: 40,
        customer: 60,
      },
      keyMoments: [
        { time: "0:30", label: "Discovery Phase" },
        { time: "2:45", label: "Pain Points Identified" },
        { time: "4:20", label: "Proposal Requested" },
      ],
      strengths: [
        "Outstanding discovery technique",
        "Perfect talk-listen ratio",
        "Strong qualification framework",
        "Excellent rapport building",
      ],
      improvements: [
        "Continue this excellent execution",
      ],
    },
  ];

  const selectedCall = calls.find((c) => c.id === selectedCallId) || calls[0];

  // Convert duration string (MM:SS) to seconds
  const parseDuration = (duration: string): number => {
    const [mins, secs] = duration.split(':').map(Number);
    return mins * 60 + secs;
  };

  const callDuration = parseDuration(selectedCall.duration);

  // Scheduled calls
  const scheduledCalls = [
    {
      id: 1,
      customer: "Robert Anderson",
      company: "TechFlow Inc.",
      type: "Discovery",
      date: "Jan 21, 2026",
      time: "10:00 AM",
      duration: "30 min",
      priority: "high",
      notes: "C-level stakeholder. Focus on scalability pain points.",
      linkedIn: "https://linkedin.com/in/robert-anderson",
      preparationTips: [
        "Review their recent product launch announcement",
        "Prepare ROI calculator for enterprise tier",
        "Research competitor solutions they're currently using",
      ],
    },
    {
      id: 2,
      customer: "Lisa Martinez",
      company: "CloudNine Solutions",
      type: "Demo",
      date: "Jan 21, 2026",
      time: "2:00 PM",
      duration: "45 min",
      priority: "medium",
      notes: "Follow-up from discovery. Demo custom integration features.",
      linkedIn: "https://linkedin.com/in/lisa-martinez",
      preparationTips: [
        "Set up demo environment with their use case",
        "Prepare integration architecture diagram",
      ],
    },
    {
      id: 3,
      customer: "James Park",
      company: "DataVault Systems",
      type: "Follow-up",
      date: "Jan 21, 2026",
      time: "4:30 PM",
      duration: "20 min",
      priority: "high",
      notes: "Address security concerns from last call. Close deal.",
      linkedIn: "https://linkedin.com/in/james-park",
      preparationTips: [
        "Prepare security compliance documentation",
        "Have pricing proposal ready",
        "Prepare urgency talking points (Q1 deadline)",
      ],
    },
  ];

  // Performance trend data
  const performanceTrend = [
    { week: "Week 1", score: 78 },
    { week: "Week 2", score: 82 },
    { week: "Week 3", score: 79 },
    { week: "Week 4", score: 85 },
  ];

  // Dimension data for chart
  const dimensionData = [
    { name: "Discovery", score: selectedCall.dimensions.discovery },
    { name: "Qualification", score: selectedCall.dimensions.qualification },
    { name: "Objection", score: selectedCall.dimensions.objectionHandling },
    { name: "Closing", score: selectedCall.dimensions.closing },
    { name: "Rapport", score: selectedCall.dimensions.rapportBuilding },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

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

  // Sort calls based on selected criteria
  const sortedCalls = [...calls].sort((a, b) => {
    if (callSortBy === "score") {
      return b.score - a.score; // Highest score first
    } else if (callSortBy === "name") {
      return a.customer.localeCompare(b.customer);
    } else { // date
      // For simplicity, using time as proxy - in real app would parse date+time
      const timeA = a.time.includes("AM") || a.time.includes("PM") 
        ? parseInt(a.time) + (a.time.includes("PM") && !a.time.startsWith("12") ? 12 : 0)
        : parseInt(a.time);
      const timeB = b.time.includes("AM") || b.time.includes("PM")
        ? parseInt(b.time) + (b.time.includes("PM") && !b.time.startsWith("12") ? 12 : 0)
        : parseInt(b.time);
      return timeB - timeA; // Most recent first
    }
  });

  // Sort scheduled calls based on selected criteria
  const sortedScheduledCalls = [...scheduledCalls].sort((a, b) => {
    if (scheduleSortBy === "name") {
      return a.customer.localeCompare(b.customer);
    } else if (scheduleSortBy === "type") {
      return a.type.localeCompare(b.type);
    } else { // date
      const timeA = parseInt(a.time);
      const timeB = parseInt(b.time);
      return timeA - timeB; // Earliest first
    }
  });

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white px-8 py-8 shadow-2xl border-b border-cyan-500/20">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-cyan-400">Multiplicity Rep Performance Dashboard</h1>
          <p className="text-cyan-200">Real-Time Call Scoring & Coaching Insights</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-white">85</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+5 vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Calls This Week</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400 mt-2">3 scheduled today</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow group relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-400">Win Rate</p>
                  <div className="relative group/tooltip">
                    <Info className="w-3.5 h-3.5 text-gray-500 hover:text-cyan-400 cursor-help transition-colors" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 bg-gray-900 border border-cyan-500/40 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                      <p className="font-semibold text-cyan-400 mb-1">How is this calculated?</p>
                      <p>Win Rate = (Successful Outcomes / Total Calls) × 100</p>
                      <p className="mt-1 text-gray-400">Successful outcomes include: demos scheduled, proposals sent, and deals closed.</p>
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">68%</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12% vs team avg</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Top Skill</p>
                <p className="text-xl font-bold text-white">Objection Handling</p>
                <p className="text-sm text-gray-400 mt-2">Avg: 90/100</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Recent Calls */}
          <div className="col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-400">Recent Calls</h2>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={callSortBy}
                  onChange={(e) => setCallSortBy(e.target.value as "date" | "score" | "name")}
                  className="bg-[#1e293b] border border-cyan-500/30 text-cyan-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                >
                  <option value="date">By Date</option>
                  <option value="score">By Score</option>
                  <option value="name">By Name</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {sortedCalls.map((call) => (
                <Card
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    selectedCallId === call.id
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/30 bg-[#1e3a5f]"
                      : "border-cyan-500/20 hover:border-cyan-500/40 bg-[#1e293b] hover:shadow-md hover:shadow-cyan-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">{call.rep}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs border-cyan-500/40 text-cyan-300">
                          {call.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">
                        {call.date} • {call.time}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-2xl font-bold ${getScoreColor(call.score)}`}>
                        {call.score}
                      </div>
                      <span className="text-xs text-gray-500">/100</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Performance Trend */}
            <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 mt-6">
              <h3 className="text-sm font-semibold text-white mb-4">4-Week Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#475569" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="##475569" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #06b6d4",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Scheduled Calls */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Today's Schedule</h3>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  <select
                    value={scheduleSortBy}
                    onChange={(e) => setScheduleSortBy(e.target.value as "date" | "name" | "type")}
                    className="bg-[#1e293b] border border-cyan-500/30 text-cyan-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="date">By Time</option>
                    <option value="name">By Name</option>
                    <option value="type">By Topic</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {sortedScheduledCalls.map((call) => (
                  <Card
                    key={call.id}
                    className="p-4 border border-cyan-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white text-sm">{call.customer}</p>
                          {call.priority === "high" && (
                            <Badge className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{call.company}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{call.time}</span>
                          </div>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs border-cyan-500/40 text-cyan-300">
                            {call.type}
                          </Badge>
                          <span>•</span>
                          <span>{call.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 mb-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-300">{call.notes}</p>
                      </div>
                    </div>

                    {/* Preparation Tips */}
                    <details className="group">
                      <summary className="text-xs font-semibold text-cyan-400 cursor-pointer hover:text-cyan-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Prep Tips ({call.preparationTips.length})
                      </summary>
                      <ul className="mt-2 space-y-1 pl-4">
                        {call.preparationTips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </details>

                    {/* Action Button */}
                    <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white border-0 h-8 text-xs"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Join Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 h-8 px-2"
                        onClick={() => window.open(call.linkedIn, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Call Details */}
          <div className="col-span-8">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Call Analysis</h2>

            {/* Score & Summary */}
            <Card className="p-6 border border-cyan-500/30 bg-[#1e293b] shadow-lg shadow-cyan-500/10 mb-6">
              <div className="flex items-start gap-6 pb-6 border-b border-gray-700">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-4 ${getScoreBg(selectedCall.score)} shadow-lg`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(selectedCall.score)}`}>
                      {selectedCall.score}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">/100</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400">Rep:</span>
                    <span className="text-sm text-white">{selectedCall.rep}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Customer: {selectedCall.customer}</h3>
                  <p className="text-sm text-gray-400 mb-3">{selectedCall.company} • {selectedCall.industry}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">{selectedCall.type}</Badge>
                    <span className="text-sm text-gray-400">{selectedCall.date} • {selectedCall.time}</span>
                    <span className="text-sm text-gray-400">• Duration: {selectedCall.duration}</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-3">
                    <p className="text-sm text-gray-200 leading-relaxed">{selectedCall.summary}</p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="py-6 border-b border-gray-700">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-4 mb-3">
                    <Button
                      onClick={handleSkipBack}
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handlePlayPause}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 w-10 h-10"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </Button>
                    <Button
                      onClick={handleSkipForward}
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-cyan-400 font-medium">{formatTime(currentTime)}</span>
                        <input
                          type="range"
                          min="0"
                          max={callDuration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <span className="text-sm text-gray-400">{formatTime(callDuration)}</span>
                      </div>
                    </div>
                    <Volume2 className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  {/* Key Moments */}
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    {selectedCall.keyMoments.map((moment, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-cyan-500/40 text-cyan-300">
                        {moment.time} - {moment.label}
                      </Badge>
                    ))}
                  </div>

                  {/* Talk Ratio */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Talk Ratio</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-cyan-400">Rep {selectedCall.talkRatio.rep}%</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-blue-400">Customer {selectedCall.talkRatio.customer}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-cyan-500 h-full" 
                        style={{ width: `${selectedCall.talkRatio.rep}%` }}
                      />
                      <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${selectedCall.talkRatio.customer}%` }}
                      />
                    </div>
                  </div>

                  {/* View Transcript Button */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setShowTranscript(!showTranscript)}
                      size="sm"
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white border-0 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {showTranscript ? "Hide Transcript" : "View Transcript"}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>

                  {/* Transcript Content */}
                  {showTranscript && (
                    <div className="mt-4 bg-gray-900/50 rounded-lg p-4 border border-gray-600 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Conversation</span>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs">
                          {selectedCall.duration}
                        </Badge>
                      </div>
                      <pre className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedCall.transcript}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Dimensions Bar Chart */}
              <div className="pt-6">
                <h4 className="text-sm font-semibold text-white mb-4">Performance Dimensions</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dimensionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#475569" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: '#9ca3af' }} stroke="#475569" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />
                    <Bar dataKey="score" fill="#06b6d4" radius={[0, 8, 8, 0]}>
                      {dimensionData.map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="score" fill={getBarColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Insights Timeline */}
            <Card className="p-6 border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-lg shadow-cyan-500/10 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">AI Real-Time Insights</h4>
                  <p className="text-xs text-gray-400">Key moments and coaching opportunities identified during the call</p>
                </div>
              </div>
              <div className="space-y-3">
                {selectedCall.aiInsights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border-l-4 ${
                      insight.type === 'positive' 
                        ? 'bg-emerald-500/10 border-emerald-500' 
                        : insight.type === 'improvement'
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-red-500/10 border-red-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs border-cyan-500/40 text-cyan-300 mt-0.5">
                        {insight.timestamp}
                      </Badge>
                      <p className="text-sm text-gray-200 flex-1">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Coaching Summary */}
            <Card className="p-6 border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 shadow-lg shadow-purple-500/10 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">AI Coaching Summary</h4>
                  <p className="text-sm text-gray-200 leading-relaxed mb-4">{selectedCall.coaching}</p>
                  
                  {/* Detailed Recommendations */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-300 mb-2">🎯 Actionable Next Steps:</p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">1.</span>
                        <span>Review objection handling specific to booking the next meeting and trial closes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">2.</span>
                        <span>Practice urgency creation scripts with time-bound offers (e.g., "if we were able to offer Q1 pricing, would you feel comfortable moving forward by March 31st?")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">3.</span>
                        <span>Implement active listening cues: paraphrasing and confirmation questions to improve talk/listen ratio to 55/45</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 border border-emerald-500/40 bg-[#1e293b] shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-white">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {selectedCall.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 border border-amber-500/40 bg-[#1e293b] shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-white">Top Area of Opportunity</h4>
                </div>
                <ul className="space-y-2">
                  {selectedCall.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AIChatPanel
        role="rep"
        context={{
          userName: 'Sarah',
          overallScore: 85,
          recentCalls: calls.map(c => ({ customer: c.customer, score: c.score, type: c.type })),
          strengths: selectedCall.strengths,
          improvements: selectedCall.improvements,
        }}
      />
    </div>
  );
}