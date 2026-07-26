export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-lg bg-white px-4 py-3 shadow-sm">
        <span className="size-2 animate-bounce rounded-full bg-[#5FC2BA]" />
        <span className="size-2 animate-bounce rounded-full bg-[#5FC2BA] [animation-delay:120ms]" />
        <span className="size-2 animate-bounce rounded-full bg-[#5FC2BA] [animation-delay:240ms]" />
      </div>
    </div>
  );
}
