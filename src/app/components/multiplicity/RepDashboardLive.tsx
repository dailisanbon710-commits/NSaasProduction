import { useEffect, useMemo, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { TrendingUp, AlertCircle, Zap, Target, ArrowRight } from "lucide-react";
import { useAllCalls, useCallDetails } from "../../../services/hooks";
import { formatDate, formatTime } from "../../../services/utils";

interface MultiplicityRepDashboardLiveProps {
  onCallClick?: () => void;
}

export function MultiplicityRepDashboardLive({ onCallClick }: MultiplicityRepDashboardLiveProps) {
  const { data: calls, loading: callsLoading } = useAllCalls();
  const [selectedCallId, setSelectedCallId] = useState<string>("");
  const { data: details } = useCallDetails(selectedCallId);

  const selectedScore = details?.analysis?.scores?.overall ?? 0;
  const avgScore = useMemo(() => {
    if (!calls || calls.length === 0) return 0;
    const scores = calls
      .map((c: any) => c?.analysis?.scores?.overall)
      .filter((n: any) => typeof n === "number") as number[];
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [calls]);

  const multiplicityScore = selectedCallId ? selectedScore : avgScore;
  const scoreChange = 0; // Placeholder until we compute deltas

  useEffect(() => {
    if (calls && calls.length && !selectedCallId) {
      setSelectedCallId(calls[0].id);
    }
  }, [calls, selectedCallId]);

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

  const getRiskBadge = (call: any) => {
    const outcome = (call?.outcome || "").toLowerCase();
    const status = (call?.status || "").toLowerCase();
    const score = call?.analysis?.scores?.overall ?? 0;

    const high = status.includes("blocked") || outcome.includes("lost") || score < 60;
    const low = outcome.includes("advancing") || outcome.includes("scheduled") || score >= 85;

    if (high) return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">High Risk</Badge>;
    if (low) return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Low Risk</Badge>;
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
                  <span className="text-2xl font-semibold">{scoreChange >= 0 ? "+" : ""}{scoreChange}</span>
                </div>
              </div>
              <p className="text-purple-100 mt-2">from recent calls</p>
            </div>
            <div className="text-right">
              <div className="w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/10">
                <div className="text-center">
                  <div className="text-5xl mb-1">🚀</div>
                  <p className="text-xs text-white font-semibold">Live</p>
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
            <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👑</span>
                <p className="text-gray-200 flex-1">Champion engagement improved</p>
                <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-red-500/5 border-red-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <p className="text-gray-200 flex-1">Economic buyer not identified</p>
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎓</span>
                <p className="text-gray-200 flex-1">Taught new insight on ROI</p>
              </div>
            </div>
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
              <p className="text-lg text-white mb-2">Schedule call with Economic Buyer before Friday</p>
              <p className="text-sm text-gray-300">Decision timeline compressed - competitor meeting scheduled next week</p>
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

          {callsLoading ? (
            <Card className="bg-[#12121a] border-white/10 p-5">
              <div className="h-24 w-full animate-pulse bg-white/5 rounded" />
            </Card>
          ) : calls && calls.length ? (
            <div className="space-y-3">
              {calls.map((call: any) => {
                const score = call?.analysis?.scores?.overall ?? 0;
                const created = call?.created_at;
                const prospectLabel = `${call?.customer_name || "Customer"} - ${call?.call_type || "Call"}`;
                return (
                  <Card
                    key={call.id}
                    className="bg-[#12121a] border-white/10 p-5 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedCallId(call.id);
                      onCallClick?.();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{prospectLabel}</h4>
                          {getRiskBadge(call)}
                          <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                            {call?.outcome || ""}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          {created ? formatDate(created) : ""} {created ? `at ${formatTime(created)}` : ""}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center ${getScoreBg(score)}`}>
                          <div>
                            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
                            <div className="text-xs text-gray-500">/100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-[#12121a] border-white/10 p-5">
              <p className="text-sm text-gray-400">No calls found.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
