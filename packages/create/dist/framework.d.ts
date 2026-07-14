export type Framework = "opencode" | "claude-code" | "cursor" | "generic";
export interface DetectionResult {
    framework: Framework;
    confidence: number;
}
export declare function detectFramework(cwd: string): DetectionResult;
export interface McpServerConfig {
    command: string;
    args: string[];
}
export declare function getMcpServerConfig(cwd: string, install: boolean, global: boolean): McpServerConfig;
export declare function injectMcpConfig(framework: Framework, cwd: string, config: McpServerConfig): boolean;
export declare function getAgentsMdPath(cwd: string): string | null;
