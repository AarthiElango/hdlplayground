import {
    Tooltip as Tooltipper,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  title:string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, title, side='top' }: TooltipProps) {


    return (
         <TooltipProvider delayDuration={300}>
        <Tooltipper>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side}>
                <p>{title}</p>
            </TooltipContent>
        </Tooltipper>
        </TooltipProvider>
    )
}