import type { JobQueueHooks } from "@/types/platform";

import { logger } from "./logger.service";

export type JobName =
  | "pdf.generation"
  | "ai.processing"
  | "image.optimization"
  | "email.queue";

export interface JobPayloadMap {
  "pdf.generation": { documentId: string; template: string };
  "ai.processing": { taskId: string; input: Record<string, unknown> };
  "image.optimization": { mediaId: string };
  "email.queue": { to: string; template: string; data: Record<string, unknown> };
}

/** Synchronous stub — replace with Inngest/BullMQ when background workers are added */
export const jobQueueHooks: JobQueueHooks = {
  enqueue: async <T>(jobName: string, payload: T) => {
    logger.info("Job enqueued (stub)", {
      context: "job-queue",
      metadata: { jobName, payload },
    });

    return `job-stub-${Date.now()}`;
  },
};

export async function enqueueJob<K extends JobName>(
  jobName: K,
  payload: JobPayloadMap[K],
): Promise<string> {
  if (!jobQueueHooks.enqueue) {
    throw new Error("Job queue is not configured.");
  }

  return jobQueueHooks.enqueue(jobName, payload);
}
