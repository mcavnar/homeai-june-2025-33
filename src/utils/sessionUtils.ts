
export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('anonymous_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('anonymous_session_id', sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): void => {
  localStorage.removeItem('anonymous_session_id');
};
