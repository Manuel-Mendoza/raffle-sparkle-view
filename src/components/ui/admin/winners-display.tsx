import { useState } from "react";
import { Button } from "@/components/ui/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { IndividualWinners } from "@/components/ui/raffle/individual-winners";
import { useIndividualWinners } from "@/hooks/use-individual-winners";
import { Loader2 } from "lucide-react";

interface WinnersDisplayProps {
  raffleId: string;
  raffleTitle?: string;
}

export function WinnersDisplay({ raffleId, raffleTitle }: WinnersDisplayProps) {
  const { winners, loading, error, refetch } = useIndividualWinners(raffleId);

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Ganadores de la Rifa
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <IndividualWinners
          winners={winners}
          loading={loading}
          onRefresh={refetch}
          raffleTitle={raffleTitle}
        />
      </CardContent>
    </Card>
  );
}
