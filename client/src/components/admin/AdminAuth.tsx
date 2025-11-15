import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simple password check
    if (password === "admin123") {
      // Store authentication in session storage
      sessionStorage.setItem("adminAuthenticated", "true");
      onAuthenticated();
    } else {
      setError("رمز عبور اشتباه است");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            ورود به پنل مدیریت
          </CardTitle>
          <CardDescription className="text-gray-400">
            لطفاً رمز عبور را برای دسترسی به پنل مدیریت وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white pl-10 pr-4 focus:border-primary transition-colors"
                  placeholder="رمز عبور را وارد کنید"
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/50 rounded p-2">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال بررسی..." : "ورود"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}