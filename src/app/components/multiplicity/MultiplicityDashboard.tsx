import { useState } from "react";
import { RepPerformanceDashboard } from "./RepPerformanceDashboard";
import { ManagerPerformanceDashboard } from "./ManagerPerformanceDashboard";
import { Button } from "@/app/components/ui/button";
import { ShareDialog } from "@/app/components/share/ShareDialog";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { User, Users, Share2, LogOut } from "lucide-react";

export function MultiplicityDashboard() {
  const [view, setView] = useState<"rep" | "manager">("rep");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* View Switcher & Actions */}
      <div className="fixed top-6 right-8 z-50 flex gap-2">
        {/* Share & Logout */}
        <div className="flex gap-2 bg-[#1e293b] border border-cyan-500/30 rounded-lg p-1 shadow-xl shadow-cyan-500/20">
          <Button
            size="sm"
            onClick={() => setShowShareDialog(true)}
            className="bg-transparent text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 border-0"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={() => signOut()}
            className="bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white border-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 bg-[#1e293b] border border-cyan-500/30 rounded-lg p-1 shadow-xl shadow-cyan-500/20">
          <Button
            size="sm"
            onClick={() => setView("rep")}
            className={
              view === "rep"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg"
                : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white border-0"
            }
          >
            <User className="w-4 h-4 mr-2" />
            Rep View
          </Button>
          <Button
            size="sm"
            onClick={() => setView("manager")}
            className={
              view === "manager"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg"
                : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white border-0"
            }
          >
            <Users className="w-4 h-4 mr-2" />
            Manager View
          </Button>
        </div>
      </div>

      {/* Render View */}
      {view === "rep" ? <RepPerformanceDashboard /> : <ManagerPerformanceDashboard />}

      {/* Share Dialog */}
      {showShareDialog && <ShareDialog onClose={() => setShowShareDialog(false)} />}
    </div>
  );
}