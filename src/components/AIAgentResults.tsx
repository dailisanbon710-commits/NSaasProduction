/**
 * AI Agent Results Component
 * Displays detailed results from all 5 AI agents + master orchestrator
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface AIAgentResultsProps {
  callId: string;
}

export function AIAgentResults({ callId }: AIAgentResultsProps) {
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAgentResults();
  }, [callId]);

  async function fetchAgentResults() {
    setLoading(true);

    // Fetch all agent analysis
    const { data: agentAnalysis } = await supabase
      .from('agent_analysis')
      .select('*')
      .eq('call_id', callId);

    // Fetch master coach report
    const { data: masterReport } = await supabase
      .from('master_coach_reports')
      .select('*')
      .eq('call_id', callId)
      .single();

    // Fetch objections
    const { data: objections } = await supabase
      .from('objections')
      .select('*')
      .eq('call_id', callId);

    // Fetch questions
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('call_id', callId);

    setAgentData({
      agents: agentAnalysis || [],
      master: masterReport,
      objections: objections || [],
      questions: questions || []
    });

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!agentData?.master) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">
          🤖 AI Agent analysis not yet available for this call. Run: <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">npx tsx scripts/run-ai-agents.ts</code>
        </p>
      </div>
    );
  }

  const { master, agents, objections, questions } = agentData;

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'objections', label: '🛡️ Objections', icon: '🛡️', count: objections.length },
    { id: 'discovery', label: '🔍 Discovery', icon: '🔍' },
    { id: 'closing', label: '🎯 Closing', icon: '🎯' },
    { id: 'talk-time', label: '⏱️ Talk-Time', icon: '⏱️' },
    { id: 'questions', label: '❓ Questions', icon: '❓', count: questions.length }
  ];

  const getAgentData = (type: string) => agents.find((a: any) => a.agent_type === type);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                {master.overall_score}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Overall Performance</p>
            </div>

            {/* Agent Scores */}
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(master.agent_scores || {}).map(([key, score]: [string, any]) => (
                <div key={key} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{score}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💪 Top Strengths</h3>
              <ul className="space-y-2">
                {master.top_strengths?.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Improvements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📈 Top Improvements</h3>
              <ul className="space-y-2">
                {master.top_improvements?.map((improvement: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-orange-500 mr-2">→</span>
                    <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'objections' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🛡️ Objection Handling ({objections.length} objections)</h3>
            {objections.map((obj: any, i: number) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{obj.timestamp}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    obj.severity === 'high' ? 'bg-red-100 text-red-700' :
                    obj.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {obj.severity}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">"{obj.customer_said}"</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Rep: "{obj.rep_response}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Score: <strong>{obj.response_score}/10</strong></span>
                  <span className={`text-sm ${obj.was_resolved ? 'text-green-600' : 'text-red-600'}`}>
                    {obj.was_resolved ? '✓ Resolved' : '✗ Unresolved'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add other tabs as needed */}
      </div>
    </div>
  );
}

