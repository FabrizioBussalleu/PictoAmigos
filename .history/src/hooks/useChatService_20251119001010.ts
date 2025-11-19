import { useCallback, useMemo, useRef } from 'react';

import { apiPost } from '../services/apiClient';
import type { ChatRequestPayload, ChatResponsePayload } from '../types/chat';
import { appConfig } from '../config';

interface UseChatServiceOptions {
  sessionId?: string;
}

export function useChatService(options?: UseChatServiceOptions) {
  const fallbackSessionId = useRef<string | null>(null);

  const sessionId = useMemo(() => {
    if (options?.sessionId) {
      return options.sessionId;
    }

    if (fallbackSessionId.current) {
      return fallbackSessionId.current;
    }

    const stored = window.localStorage.getItem(appConfig.defaultSessionStorageKey);
    if (stored) {
      fallbackSessionId.current = stored;
      return stored;
    }

    const generated = crypto.randomUUID();
    fallbackSessionId.current = generated;
    window.localStorage.setItem(appConfig.defaultSessionStorageKey, generated);
    return generated;
  }, [options?.sessionId]);

  const sendMessage = useCallback(
    (payload: ChatRequestPayload, signal?: AbortSignal) => {
      const request = {
        session_id: sessionId,
        message: {
          text: payload.text,
          include_pictos: payload.includePictograms ?? true,
        },
      };

      return apiPost<ChatResponsePayload>('/chat', request, signal);
    },
    [sessionId],
  );

  return {
    sessionId,
    sendMessage,
  };
}
