const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function LoadingSpinner({ size = 'md' }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${sizes[size]} border-2 border-industrial-600/30 border-t-primary-500 rounded-full animate-spin`} />
      <span className="text-xs text-industrial-400 animate-pulse">Loading...</span>
    </div>
  );
}
