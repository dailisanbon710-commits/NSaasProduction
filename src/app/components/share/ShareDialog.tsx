import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Share2, Mail, Copy, Check, Trash2, X } from 'lucide-react';

export function ShareDialog({ onClose }: { onClose: () => void }) {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [shares, setShares] = useState<any[]>([]);

  const loadShares = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7fa4a1b1/shares/my`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShares(data.shares || []);
      }
    } catch (err) {
      console.error('Failed to load shares:', err);
    }
  };

  useState(() => {
    loadShares();
  });

  const handleCreateShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;

    setError('');
    setLoading(true);
    setShareUrl('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7fa4a1b1/share/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            sharedWithEmail: email,
            permission,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create share link');
      }

      setShareUrl(data.shareUrl);
      setEmail('');
      loadShares(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (shareToken: string) => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7fa4a1b1/share/${shareToken}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        loadShares(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to revoke share:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border border-cyan-500/30 bg-[#1e293b] shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Dashboard</h2>
                <p className="text-sm text-gray-400">Give access to specific people</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Create Share Form */}
          <form onSubmit={handleCreateShare} className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Share with email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="colleague@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Permission</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPermission('view')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      permission === 'view'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    View Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermission('edit')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      permission === 'edit'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    Can Edit
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-cyan-500/20"
              >
                {loading ? 'Creating...' : 'Create Share Link'}
              </Button>
            </div>
          </form>

          {/* Share URL Result */}
          {shareUrl && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-sm font-medium text-emerald-300 mb-2">✅ Share link created!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300"
                />
                <Button
                  onClick={handleCopy}
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Active Shares List */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Active Shares ({shares.length})</h3>
            {shares.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No active shares yet</p>
            ) : (
              <div className="space-y-2">
                {shares.map((share) => (
                  <div
                    key={share.shareToken}
                    className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{share.sharedWithEmail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            share.permission === 'edit'
                              ? 'border-blue-500/40 text-blue-300'
                              : 'border-cyan-500/40 text-cyan-300'
                          }`}
                        >
                          {share.permission}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(share.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevoke(share.shareToken)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
