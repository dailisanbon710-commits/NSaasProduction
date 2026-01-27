import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";

interface CallComparisonProps {
  onBack: () => void;
}

export function CallComparison({ onBack }: CallComparisonProps) {
  const sarah = {
    name: "Sarah Johnson",
    customer: "Michael Chen",
    type: "🎯 Demo",
    date: "Jan 20, 2026 at 10:00 AM",
    overallScore: 85,
    dimensions: {
      discovery: 85,
      qualification: 82,
      objectionHandling: 90,
      closing: 78,
      rapport: 88,
    },
    strengths: [
      "Strong questioning technique in discovery",
      "Confident product knowledge",
      "Excellent rapport with C-level stakeholder",
    ],
    improvements: [
      "Add urgency in closing",
      "Reduce talk-time ratio (currently 65/35)",
    ],
  };

  const tom = {
    name: "Tom Martinez",
    customer: "Jennifer Wu",
    type: "📞 Outbound",
    date: "Jan 20, 2026 at 10:00 AM",
    overallScore: 52,
    dimensions: {
      discovery: 45,
      qualification: 38,
      objectionHandling: 55,
      closing: 42,
      rapport: 80,
    },
    strengths: [
      "Good initial rapport building",
      "Professional tone maintained",
    ],
    improvements: [
      "Improve discovery questioning",
      "Better objection handling needed",
      "Work on qualification skills",
    ],
  };

  const scoreDiff = sarah.overallScore - tom.overallScore;

  const comparisons = [
    { name: "Discovery", sarah: sarah.dimensions.discovery, tom: tom.dimensions.discovery },
    { name: "Qualification", sarah: sarah.dimensions.qualification, tom: tom.dimensions.qualification },
    { name: "Objection Handling", sarah: sarah.dimensions.objectionHandling, tom: tom.dimensions.objectionHandling },
    { name: "Closing", sarah: sarah.dimensions.closing, tom: tom.dimensions.closing },
    { name: "Rapport", sarah: sarah.dimensions.rapport, tom: tom.dimensions.rapport },
  ];

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Comparison</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sarah Chen vs Tom Martinez</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Winner Banner */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 p-6 text-white shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Sarah by {scoreDiff} points</h2>
          </div>
        </Card>

        {/* Overall Scores */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-emerald-50 border border-emerald-200 p-8">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{sarah.name}</p>
              <div className="text-6xl font-bold text-emerald-600">{sarah.overallScore}</div>
              <div className="text-xl text-gray-500">/100</div>
              <p className="text-sm text-gray-600 mt-2">{sarah.type}</p>
            </div>
          </Card>

          <Card className="bg-red-50 border border-red-200 p-8">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{tom.name}</p>
              <div className="text-6xl font-bold text-red-600">{tom.overallScore}</div>
              <div className="text-xl text-gray-500">/100</div>
              <p className="text-sm text-gray-600 mt-2">{tom.type}</p>
            </div>
          </Card>
        </div>

        {/* Dimension Comparison Table */}
        <Card className="bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dimension Breakdown</h2>
          <div className="space-y-4">
            {comparisons.map((comp, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <p className="text-sm font-medium text-gray-700 mb-3">{comp.name}</p>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className={`text-center p-3 rounded-lg ${comp.sarah > comp.tom ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50"}`}>
                    <div className={`text-2xl font-bold ${comp.sarah > comp.tom ? "text-emerald-600" : "text-gray-600"}`}>
                      {comp.sarah}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Sarah</p>
                  </div>

                  <div className="text-center">
                    <Badge className={`${comp.sarah > comp.tom ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                      Sarah +{comp.sarah - comp.tom}
                    </Badge>
                  </div>

                  <div className={`text-center p-3 rounded-lg ${comp.tom > comp.sarah ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50"}`}>
                    <div className={`text-2xl font-bold ${comp.tom > comp.sarah ? "text-emerald-600" : "text-gray-600"}`}>
                      {comp.tom}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tom</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Side-by-Side Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sarah */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{sarah.name}</h3>
            
            <Card className="bg-white border border-gray-200 p-5">
              <h4 className="font-medium text-emerald-600 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {sarah.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600">•</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-white border border-gray-200 p-5">
              <h4 className="font-medium text-yellow-600 mb-3">Improvements</h4>
              <ul className="space-y-2">
                {sarah.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-600">•</span>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Tom */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{tom.name}</h3>
            
            <Card className="bg-white border border-gray-200 p-5">
              <h4 className="font-medium text-emerald-600 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {tom.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600">•</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-white border border-gray-200 p-5">
              <h4 className="font-medium text-yellow-600 mb-3">Improvements</h4>
              <ul className="space-y-2">
                {tom.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-600">•</span>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}