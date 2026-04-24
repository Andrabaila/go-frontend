import { BUILD_INFO } from '@/constants/buildInfo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 text-lg text-slate-400 transition hover:text-slate-700"
          onClick={onClose}
          aria-label="Close about dialog"
        >
          ✕
        </button>

        <h2 className="mb-5 text-xl font-bold">About</h2>

        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-slate-100 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Version
            </div>
            <div className="mt-1 font-mono text-base font-semibold">
              {BUILD_INFO.version}
            </div>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Built
            </div>
            <div className="mt-1 font-mono text-base font-semibold">
              {BUILD_INFO.builtAt}
            </div>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Commit
            </div>
            <div className="mt-1 font-mono text-base font-semibold">
              {BUILD_INFO.commit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
