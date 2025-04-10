export interface TypeInjectGlobalConfig {
  outDir: string;
  mainPath: string;
  aliases: { path: string, alias?: string }[];
  tests?: {
    generateForTests: boolean;
    outDir: string;
  }
}