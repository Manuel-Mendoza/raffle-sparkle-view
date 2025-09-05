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
    <div className={cn("w-full py-4 px-2", className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "bg-primary/20 border-primary text-primary animate-pulse"
                      : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
                ) : (
                  <span className="font-bold text-xs sm:text-sm md:text-base">{step.id}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-1 sm:mt-2 text-center">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors leading-tight",
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 max-w-16 sm:max-w-20 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 relative">
                <div
                  className={cn(
                    "absolute top-4 sm:top-5 md:top-6 left-2 right-2 h-0.5 transition-colors duration-300",
                    currentStep > step.id
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
