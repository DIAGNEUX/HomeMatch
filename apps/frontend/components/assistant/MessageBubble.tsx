import { Message } from "@/types/assistant";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[68%]",
          isUser
            ? "bg-[#F5F8FB] text-[#28435E]"
            : "bg-white text-[#0B162C]",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
