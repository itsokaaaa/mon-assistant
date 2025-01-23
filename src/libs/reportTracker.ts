// src/libs/reportTracker.ts
const reportCounts: Record<string, number> = {};

export function incrementReportCount(user: string) {
  if (reportCounts[user]) {
    reportCounts[user]++;
  } else {
    reportCounts[user] = 1;
  }
}

export function getReportCounts() {
  return reportCounts;
}