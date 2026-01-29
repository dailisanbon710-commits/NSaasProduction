/**
 * AI Coach Panel - Shows AI coaching insights for a call
 */

import React from 'react';
import type { MasterCoachReport, Objection, Question, AgentAnalysis } from '../../../services/types';

interface AICoachPanelProps {
  masterReport: MasterCoachReport | null;
  objections: Objection[];
  questions: Question[];
  agentAnalysis: AgentAnalysis[];
}

export function AICoachPanel({ masterReport, objections, questions, agentAnalysis }: AICoachPanelProps) {
  // Debug logging
  console.log('🎯 AICoachPanel rendering with:', {
    masterReport,
    objectionsCount: objections?.length || 0,
    questionsCount: questions?.length || 0,
    objections,
    questions
  });

  if (!masterReport && objections.length === 0 && questions.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 text-center border border-slate-700">
        <p className="text-slate-400">No AI coaching data available for this call yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Master Coach Summary */}
      {masterReport && (
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              🧠 AI Coach Summary
            </h3>
            <div className="text-2xl font-bold text-purple-400">
              {masterReport.overall_score}/100
            </div>
          </div>

          {/* Top Strengths */}
          {masterReport.top_strengths && masterReport.top_strengths.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-emerald-400 mb-2">✅ Top Strengths</h4>
              <ul className="space-y-1">
                {masterReport.top_strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Improvements */}
          {masterReport.top_improvements && masterReport.top_improvements.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-orange-400 mb-2">🎯 Areas to Improve</h4>
              <ul className="space-y-1">
                {masterReport.top_improvements.map((improvement, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agent Scores */}
          {masterReport.agent_scores && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-blue-400 mb-2">🤖 AI Agent Scores</h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(masterReport.agent_scores).map(([key, score]: [string, any]) => (
                  <div key={key} className="bg-slate-800/50 rounded-md p-2 text-center border border-slate-700">
                    <div className="text-lg font-bold text-white">{score}</div>
                    <div className="text-[10px] text-slate-400 capitalize leading-tight">
                      {key.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Focus */}
          {masterReport.priority_coaching_focus && (
            <div className="bg-slate-800/50 rounded-md p-3 border border-purple-500/30">
              <p className="text-xs font-medium text-purple-400 mb-1">🎓 Priority Coaching Focus</p>
              <p className="text-sm text-white font-medium">{masterReport.priority_coaching_focus}</p>
            </div>
          )}

          {/* Agent Scores */}
          {masterReport.agent_scores && Object.keys(masterReport.agent_scores).length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(masterReport.agent_scores).map(([skill, score]) => (
                <div key={skill} className="bg-slate-800/50 rounded-md p-2 border border-slate-700">
                  <p className="text-xs text-slate-400 capitalize">{skill.replace(/_/g, ' ')}</p>
                  <p className={`text-base font-bold ${
                    (score as number) >= 70 ? 'text-emerald-400' :
                    (score as number) >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {score}/100
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Objections Analysis */}
      {objections && objections.length > 0 && (
        <div className="bg-slate-800/30 rounded-lg p-4 border border-orange-500/30">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            🛡️ Objections Handled ({objections.length})
          </h3>
          <div className="space-y-3">
            {objections.map((objection) => (
              <div key={objection.id} className="border-l-4 border-orange-400 pl-3 py-2 bg-slate-900/30 rounded-r">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-cyan-400">[{objection.timestamp}]</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      objection.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      objection.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {objection.category}
                    </span>
                  </div>
                  <div className={`text-sm font-bold ${
                    objection.response_score >= 7 ? 'text-emerald-400' :
                    objection.response_score >= 4 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {objection.response_score}/10
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-1">
                  <span className="font-medium text-slate-400">Customer:</span> <span className="text-white">"{objection.customer_said}"</span>
                </p>
                {objection.rep_response && (
                  <p className="text-sm text-slate-300 mb-2">
                    <span className="font-medium text-slate-400">Rep:</span> <span className="text-white">"{objection.rep_response}"</span>
                  </p>
                )}
                {objection.suggested_responses && objection.suggested_responses.length > 0 && (
                  <div className="mt-2 bg-emerald-500/10 rounded p-2 border border-emerald-500/30">
                    <p className="text-xs font-medium text-emerald-400 mb-1">💡 Better Response:</p>
                    <p className="text-sm text-slate-200">"{objection.suggested_responses[0]}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Analysis */}
      {questions && questions.length > 0 && (
        <div className="bg-slate-800/30 rounded-lg p-4 border border-blue-500/30">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            ❓ Questions Asked ({questions.length})
          </h3>
          <div className="space-y-2">
            {questions.slice(0, 5).map((question) => (
              <div key={question.id} className="border-l-4 border-blue-400 pl-3 py-2 bg-slate-900/30 rounded-r">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400">[{question.timestamp}]</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      question.question_type === 'open_ended' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      question.question_type === 'probing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {question.question_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${
                    question.quality_score >= 7 ? 'text-emerald-400' :
                    question.quality_score >= 4 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {question.quality_score}/10
                  </span>
                </div>
                <p className="text-sm text-white">"{question.question_text}"</p>
                {question.better_alternative && (
                  <div className="mt-2 bg-blue-500/10 rounded p-2 border border-blue-500/30">
                    <p className="text-xs font-medium text-blue-400 mb-1">💡 Better Alternative:</p>
                    <p className="text-sm text-slate-200">"{question.better_alternative}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

