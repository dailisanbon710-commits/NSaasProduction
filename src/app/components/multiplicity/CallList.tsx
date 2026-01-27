import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Phone } from "lucide-react";

interface CallListProps {
  onSelectCall: (callId: number) => void;
}

export function CallList({ onSelectCall }: CallListProps) {
  const calls = [
    {
      id: 1,
      rep: "Sarah Johnson",
      customer: "Michael Chen",
      type: "🎯 Demo",
      date: "Jan 20, 2026",
      time: "10:00 AM",
      score: 85,
    },
    {
      id: 2,
      rep: "Tom Martinez",
      customer: "Jennifer Wu",
      type: "📞 Outbound",
      date: "Jan 20, 2026",
      time: "10:00 AM",
      score: 52,
    },
    {
      id: 3,
      rep: "Emma Rodriguez",
      customer: "David Kim",
      type: "🔎 Discovery",
      date: "Jan 20, 2026",
      time: "8:30 AM",
      score: 88,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Call List</h2>
        <p className="text-sm text-gray-500">{calls.length} calls (newest → oldest)</p>
      </div>

      <div className="space-y-3">
        {calls.map((call) => (
          <Card
            key={call.id}
            className={`border p-5 hover:shadow-md transition-all cursor-pointer ${getScoreBg(call.score)}`}
            onClick={() => onSelectCall(call.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <Phone className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">Rep: {call.rep}</p>
                    <span className="text-gray-400">|</span>
                    <p className="font-medium text-gray-700">Customer: {call.customer}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>Call Type: {call.type}</span>
                    <span>•</span>
                    <span>Date: {call.date} at {call.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-center ml-6">
                <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                <div className={`text-4xl font-bold ${getScoreColor(call.score)}`}>
                  {call.score}
                </div>
                <div className="text-sm text-gray-500">/100</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}