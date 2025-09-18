import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { customerService } from "@/services/customer";
import { raffleService } from "@/services/raffle";
import { Loader2, CheckCircle, XCircle, Wifi } from "lucide-react";

export function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    customerTest?: boolean;
    raffleTest?: boolean;
    error?: string;
  }>({});

  const runTests = async () => {
    setLoading(true);
    setResults({});

    try {
      // Test customer service
      console.log("🧪 Testing customer service...");
      await customerService.testConnection();
      setResults((prev) => ({ ...prev, customerTest: true }));
      console.log("✅ Customer service OK");

      // Test raffle service
      console.log("🧪 Testing raffle service...");
      await raffleService.getCurrentRaffle();
      setResults((prev) => ({ ...prev, raffleTest: true }));
      console.log("✅ Raffle service OK");
    } catch (error: unknown) {
      console.error("❌ API Test failed:", error);
      setResults((prev) => ({
        ...prev,
        error: error.message || "Error de conexión",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Card className="border-blue-500/50 bg-blue-50/50 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-blue-700 flex items-center">
          <Wifi className="w-4 h-4 mr-2" />
          🧪 API Connectivity Test
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Button
            onClick={runTests}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Tests"
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs">Customer Service:</span>
            {results.customerTest === true && (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                OK
              </Badge>
            )}
            {results.customerTest === false && (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">Raffle Service:</span>
            {results.raffleTest === true && (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                OK
              </Badge>
            )}
            {results.raffleTest === false && (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>

          {results.error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              Error: {results.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
