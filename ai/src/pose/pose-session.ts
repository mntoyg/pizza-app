import { cueForFrame, type CueKey } from '../coach/cues';
import {
  createSafetyGuard,
  type SafetyAction,
  type SafetyReason,
  type TrackingQuality,
} from '../coach/safety-guard';
import type { Exercise } from '../types/exercise';
import type { Landmark } from '../types/landmark';
import { createMedianFilter, createOneEuroFilter } from './filters';
import { createRepCounter, type RepPhase } from './rep-counter';
import { extractSignal } from './signals';

export interface PoseSessionOptions {
  exercise: Exercise;
  lostPersonMs?: number;
  lowTrackingMs?: number;
}

export interface FrameInput {
  /** Landmarks of the detected person, or null when nobody was detected. */
  landmarks: readonly Landmark[] | null;
  timestampMs: number;
  /** Set false if the camera stream ended. Default true. */
  cameraActive?: boolean;
}

export interface FrameResult {
  reps: number;
  phase: RepPhase;
  /** Filtered measurement in degrees; NaN until the first usable frame. */
  value: number;
  quality: TrackingQuality;
  action: SafetyAction;
  reason?: SafetyReason;
  cue: CueKey | null;
  /** True only on the frame where a rep was completed. */
  repCompleted: boolean;
}

export interface PoseSession {
  processFrame(frame: FrameInput): FrameResult;
  confirmCarer(): void;
  requestStop(): void;
  reset(): void;
}

/**
 * Wires one exercise end to end: signal extraction -> smoothing -> safety guard -> rep counter -> cue.
 * Counting only happens while the guard says "continue"; any interruption discards the rep in
 * progress so a gap in tracking can never produce a phantom rep.
 */
export function createPoseSession(options: PoseSessionOptions): PoseSession {
  const { exercise } = options;
  const { criteria } = exercise;
  const minVisibility = criteria.minVisibility ?? 0.5;

  const counter = createRepCounter({
    up: criteria.up,
    down: criteria.down,
    minRepMs: criteria.minRepMs,
  });
  const guard = createSafetyGuard({
    needsCarer: exercise.needsCarer,
    minVisibility,
    ...(options.lostPersonMs !== undefined ? { lostPersonMs: options.lostPersonMs } : {}),
    ...(options.lowTrackingMs !== undefined ? { lowTrackingMs: options.lowTrackingMs } : {}),
  });
  const median = createMedianFilter(3);
  const smooth = createOneEuroFilter({ minCutoff: 1.5, beta: 0.02 });
  let lastValue = NaN;

  const interrupt = () => {
    counter.abandonRep();
    median.reset();
    smooth.reset();
  };

  return {
    processFrame(frame) {
      const landmarks = frame.landmarks;
      const signal =
        landmarks && landmarks.length > 0
          ? extractSignal(criteria.metric, landmarks, { minVisibility })
          : { value: NaN, visibility: 0 };

      const decision = guard.evaluate({
        timestampMs: frame.timestampMs,
        personDetected: landmarks !== null && landmarks.length > 0,
        visibility: signal.visibility,
        cameraActive: frame.cameraActive ?? true,
      });

      let repCompleted = false;
      if (decision.action !== 'continue') {
        interrupt();
      } else if (Number.isFinite(signal.value)) {
        const before = counter.state.reps;
        lastValue = smooth.filter(median.push(signal.value), frame.timestampMs);
        counter.update(lastValue, frame.timestampMs);
        repCompleted = counter.state.reps > before;
      }

      const state = counter.state;
      return {
        reps: state.reps,
        phase: state.phase,
        value: lastValue,
        quality: decision.quality,
        action: decision.action,
        ...(decision.reason !== undefined ? { reason: decision.reason } : {}),
        cue: cueForFrame({
          phase: state.phase,
          value: lastValue,
          up: criteria.up,
          down: criteria.down,
          action: decision.action,
          ...(decision.reason !== undefined ? { reason: decision.reason } : {}),
        }),
        repCompleted,
      };
    },
    confirmCarer: () => guard.confirmCarer(),
    requestStop: () => guard.requestStop(),
    reset() {
      guard.reset();
      counter.reset();
      median.reset();
      smooth.reset();
      lastValue = NaN;
    },
  };
}
