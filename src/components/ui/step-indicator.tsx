import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "bg-primary/20 border-primary text-primary animate-pulse"
                      : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-bold">{step.id}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-20">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300",
                  currentStep > step.id
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
