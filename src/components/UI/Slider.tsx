import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  labels?: string[];
  showLabels?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, labels, showLabels = true, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => (
  <div className="w-full relative">
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-metal-darkest">
        <SliderPrimitive.Range className="absolute h-full bg-metal-blue" />
      </SliderPrimitive.Track>
      
      {props.defaultValue?.map((_, i) => (
        <SliderPrimitive.Thumb 
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-metal-blue bg-white dark:bg-metal-highlight shadow-neon-blue focus:outline-none focus:ring-2 focus:ring-metal-blue focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
    
    {showLabels && labels && labels.length > 0 && (
      <div className="flex justify-between mt-1">
        {labels.map((label, i) => (
          <div key={i} className="text-xs text-gray-600 dark:text-metal-silver">{label}</div>
        ))}
      </div>
    )}
  </div>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;