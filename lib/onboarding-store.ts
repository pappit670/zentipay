/**
 * Onboarding draft — in-memory store for data collected across the onboarding
 * steps (Inspo 14). The "completed" flag lives in onboarding-context (React state
 * so the route guard reacts to it).
 */
export type OnboardingDraft = {
  method: 'phone' | 'email';
  contact: string;
  dob?: { day: number; month: number; year: number };
  ztag?: string;
  name?: string;
  avatarColor?: string;
};

export const draft: OnboardingDraft = { method: 'phone', contact: '' };

export function resetDraft() {
  draft.method = 'phone';
  draft.contact = '';
  draft.dob = undefined;
  draft.ztag = undefined;
  draft.name = undefined;
  draft.avatarColor = undefined;
}
