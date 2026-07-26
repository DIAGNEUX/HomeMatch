import { api } from "@/lib/axios";
import { ConversationResponse , ChatMessageDto} from "@/types/assistant";


const assistantService = {
  sendMessage(data: ChatMessageDto) {
    return api.post<ConversationResponse>("/ai/chat", data);
  },
};

export default assistantService;