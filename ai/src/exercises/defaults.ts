import type { Exercise } from '../types/exercise';

/**
 * Offline fallback copies of the exercise definitions. The source of truth will be the
 * `exercises` table (versioned, physiotherapist-approved). Every value here is a PLACEHOLDER
 * prototype setting, not a clinical prescription.
 */
export const DEFAULT_EXERCISES: readonly Exercise[] = [
  {
    id: 'arm-raise',
    name: 'High arm raise',
    needsCarer: false,
    targetReps: 5,
    approvalStatus: 'draft',
    criteria: { metric: 'shoulder-angle', up: 150, down: 40, minRepMs: 600 },
  },
  {
    id: 'sit-stand',
    name: 'Sit-to-stand from a chair',
    needsCarer: true,
    targetReps: 5,
    approvalStatus: 'draft',
    criteria: { metric: 'knee-angle', up: 160, down: 110, minRepMs: 800 },
  },
];
