import { Zap } from 'lucide-react';

export function Logo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const boxSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-[18px] w-[18px]';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex ${boxSize} flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft`}
      >
        <Zap className={`${iconSize} fill-current`} strokeWidth={0} />
      </span>
      {withText && <span className={`${textSize} font-bold tracking-tight text-gray-900`}>Flotik</span>}
    </span>
  );
}
