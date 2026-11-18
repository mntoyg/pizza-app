import type { Landmark } from '../types/landmark';
import { jointAngle } from './angles';

/** MediaPipe Pose Landmarker indices (33-point model). */
export const LANDMARK = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const;

export type Metric = 'shoulder-angle' | 'knee-angle';

export interface SignalOptions {
  /** A needed landmark below this visibility makes the sample unusable. Default 0.5. */
  minVisibility?: number;
  use3d?: boolean;
}

export interface Signal {
  /** Degrees, or NaN when the frame cannot be measured reliably. */
  value: number;
  /** Lowest visibility among the landmarks this metric needs (0 if they are missing). */
  visibility: number;
}

type Triple = readonly [number, number, number];

/** Each triple is (outer point, vertex, outer point); the angle is measured at the vertex. */
const TRIPLES: Record<Metric, readonly Triple[]> = {
  'shoulder-angle': [
    [LANDMARK.leftHip, LANDMARK.leftShoulder, LANDMARK.leftWrist],
    [LANDMARK.rightHip, LANDMARK.rightShoulder, LANDMARK.rightWrist],
  ],
  'knee-angle': [
    [LANDMARK.leftHip, LANDMARK.leftKnee, LANDMARK.leftAnkle],
    [LANDMARK.rightHip, LANDMARK.rightKnee, LANDMARK.rightAnkle],
  ],
};

const MIN_LANDMARKS = 29;

/** Averages the left and right side angles for the metric. Both sides must be usable. */
export function extractSignal(
  metric: Metric,
  landmarks: readonly Landmark[],
  options: SignalOptions = {},
): Signal {
  if (landmarks.length < MIN_LANDMARKS) return { value: NaN, visibility: 0 };
  const minVisibility = options.minVisibility ?? 0.5;

  let visibility = 1;
  let sum = 0;
  let usable = true;

  for (const [i, j, k] of TRIPLES[metric]) {
    const a = landmarks[i] as Landmark;
    const b = landmarks[j] as Landmark;
    const c = landmarks[k] as Landmark;
    for (const p of [a, b, c]) visibility = Math.min(visibility, p.visibility ?? 1);
    const angle = jointAngle(a, b, c, { use3d: options.use3d === true });
    if (Number.isNaN(angle)) usable = false;
    sum += angle;
  }

  if (!usable || visibility < minVisibility) return { value: NaN, visibility };
  return { value: sum / TRIPLES[metric].length, visibility };
}
