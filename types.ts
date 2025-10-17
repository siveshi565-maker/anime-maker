
export type VeoModel = 'veo-3.1-generate-preview' | 'veo-3.1-fast-generate-preview';
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface GenerateVideoOptions {
  prompt: string;
  model: VeoModel;
  aspectRatio: AspectRatio;
  resolution: Resolution;
}
