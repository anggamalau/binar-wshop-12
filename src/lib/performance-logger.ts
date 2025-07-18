export class PerformanceLogger {
  private static timers: Map<string, number> = new Map();

  public static start(label: string): void {
    this.timers.set(label, Date.now());
  }

  public static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`No start time found for timer: ${label}`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    console.log(`${label}: ${duration}ms`);
    this.timers.delete(label);
    return duration;
  }
}