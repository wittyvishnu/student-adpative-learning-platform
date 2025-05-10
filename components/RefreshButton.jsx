import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefreshButton = ({ onClick, isLoading = false, className = "" }) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">Refresh</span>
    </Button>
  );
};

export default RefreshButton;
