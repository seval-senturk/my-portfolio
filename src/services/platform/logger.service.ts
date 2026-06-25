import type { PlatformLogEntry } from "@/types/platform";

function serializeEntry(entry: PlatformLogEntry) {
  return {
    level: entry.level,
    message: entry.message,
    context: entry.context,
    metadata: entry.metadata,
    error:
      entry.error instanceof Error
        ? { name: entry.error.name, message: entry.error.message, stack: entry.error.stack }
        : undefined,
    timestamp: new Date().toISOString(),
  };
}

function write(level: PlatformLogEntry["level"], message: string, options: Omit<PlatformLogEntry, "level" | "message"> = {}) {
  const entry = serializeEntry({ level, message, ...options });

  if (process.env.NODE_ENV === "production") {
    const output = JSON.stringify(entry);

    if (level === "error" || level === "critical") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }

    return;
  }

  const prefix = `[${entry.level.toUpperCase()}]${entry.context ? ` ${entry.context}` : ""}`;

  if (level === "error" || level === "critical") {
    console.error(prefix, message, entry.metadata ?? "", entry.error ?? "");
  } else if (level === "warn") {
    console.warn(prefix, message, entry.metadata ?? "");
  } else {
    console.info(prefix, message, entry.metadata ?? "");
  }
}

export const logger = {
  info(message: string, options?: Omit<PlatformLogEntry, "level" | "message">) {
    write("info", message, options);
  },
  warn(message: string, options?: Omit<PlatformLogEntry, "level" | "message">) {
    write("warn", message, options);
  },
  error(message: string, options?: Omit<PlatformLogEntry, "level" | "message">) {
    write("error", message, options);
  },
  critical(message: string, options?: Omit<PlatformLogEntry, "level" | "message">) {
    write("critical", message, options);
  },
};

/** Future: Sentry, OpenTelemetry, Better Stack adapters register here */
export const observabilityHooks = {
  enabled: false,
  captureException: (..._args: [Error, Record<string, unknown>?]) => undefined,
  recordMetric: (..._args: [string, number, Record<string, string>?]) => undefined,
};
