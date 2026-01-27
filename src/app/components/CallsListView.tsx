import { ArrowLeft, Calendar, Clock, Phone } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

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

interface CallsListViewProps {
  calls: Call[];
  onCallClick: (call: Call) => void;
  onBack: () => void;
}

export function CallsListView({ calls, onCallClick, onBack }: CallsListViewProps) {
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

  const getRiskBadge = (risk: string) => {
    if (risk === "low") return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Low Risk</Badge>;
    if (risk === "high") return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">High Risk</Badge>;
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">Medium Risk</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl text-white mb-1">All Calls</h1>
              <p className="text-sm text-gray-400">{calls.length} total calls</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Filter
            </Button>
            <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800">
              Sort
            </Button>
          </div>
        </div>

        {/* Calls Grid */}
        <div className="grid grid-cols-1 gap-4">
          {calls.map((call) => (
            <Card
              key={call.id}
              className="bg-[#12121a] border-gray-800 p-5 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => onCallClick(call)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base text-white">{call.prospect}</h3>
                    {getRiskBadge(call.riskLevel)}
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                      {call.outcome}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {call.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {call.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {call.duration}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Score</p>
                    <div className={`text-2xl ${getScoreColor(call.score)} flex items-center justify-center w-16 h-16 rounded-lg border ${getScoreBg(call.score)}`}>
                      {call.score}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
