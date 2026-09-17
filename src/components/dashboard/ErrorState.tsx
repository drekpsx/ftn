import { AlertTriangle, RotateCw } from 'lucide-react';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="text-sm text-gray-600">{message}</p>
      <button onClick={onRetry} className="btn-secondary mt-4">
        <RotateCw className="h-4 w-4" /> Réessayer
      </button>
    </div>
  );
}
