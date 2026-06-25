import type { PlatformNotification } from "@/types/platform";

import { logger } from "./logger.service";

type NotificationChannel = "log" | "email" | "push" | "inApp";

const enabledChannels: NotificationChannel[] = ["log"];

export async function publishNotification(notification: PlatformNotification): Promise<void> {
  if (enabledChannels.includes("log")) {
    const logLevel =
      notification.level === "error"
        ? "error"
        : notification.level === "warning"
          ? "warn"
          : "info";

    logger[logLevel](notification.title, {
      context: "notification",
      metadata: {
        level: notification.level,
        message: notification.message,
        ...notification.metadata,
      },
    });
  }

  // Future channels: email, push, in-app — register without changing callers
}

export function notifySuccess(title: string, message?: string) {
  return publishNotification({ level: "success", title, message });
}

export function notifyWarning(title: string, message?: string) {
  return publishNotification({ level: "warning", title, message });
}

export function notifyError(title: string, message?: string) {
  return publishNotification({ level: "error", title, message });
}

export function notifyInfo(title: string, message?: string) {
  return publishNotification({ level: "info", title, message });
}
