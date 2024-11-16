interface JX3ReporterOptions {
    caller: string;
    api?: string;
    use_query?: boolean;
    useId?: number;
}
declare class JX3Reporter {
    private options;
    constructor(options?: JX3ReporterOptions);
    private getReportCRC;
    p(data: any, tmpCaller?: string): void;
    private getReportUrl;
    setOptions(options: JX3ReporterOptions): void;
}
export declare const Reporter: typeof JX3Reporter;
declare const _default: JX3Reporter;
export default _default;
