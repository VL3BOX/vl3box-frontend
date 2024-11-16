export declare enum EReporterCategory {
    Common = 0,
    Jump = 1
}
interface JX3ReporterOptions {
    caller: string;
    api?: string;
    use_query?: boolean;
    userId?: number;
    method?: "POST" | "GET";
}
declare class JX3Reporter {
    private options;
    private init_time;
    constructor(options?: JX3ReporterOptions);
    private getReportCRC;
    private r;
    p(data: any, tmpCaller?: string): void;
    j(data: any, tmpCaller?: string): void;
    private getReportUrl;
    setOptions(options: JX3ReporterOptions): void;
}
export { JX3Reporter as Reporter };
declare const _default: JX3Reporter;
export default _default;
