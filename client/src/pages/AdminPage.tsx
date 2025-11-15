import { useState, useEffect } from "react";
import { AdminBookingManager } from "@/components/admin/AdminBookingManager";
import { AdminAuth } from "@/components/admin/AdminAuth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated on component mount
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div>
      <div className="border-b border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">Panneau d'administration MELRING</h1>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white px-3 py-1 rounded-md text-sm border border-gray-600 hover:border-gray-500 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      <AdminBookingManager />
    </div>
  );
}