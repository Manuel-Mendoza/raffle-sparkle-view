import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";

interface DebugPanelProps {
  data: any;
  title?: string;
}

export function DebugPanel({ data, title = "Debug Info" }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-yellow-700 flex items-center">
            🐛 {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="pt-0">
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(data || {}).map(([key, value]) => (
              <Badge 
                key={key} 
                variant={value ? "default" : "destructive"}
                className="text-xs"
              >
                {key}: {value ? "✓" : "✗"}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
