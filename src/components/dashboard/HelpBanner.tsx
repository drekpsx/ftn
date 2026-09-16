import { Lightbulb } from 'lucide-react';

export function HelpBanner({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-900">
      <Lightbulb className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-brand-600" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <p className="text-brand-800/80">{children}</p>
      </div>
    </div>
  );
}
