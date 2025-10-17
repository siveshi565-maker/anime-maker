import { GoogleGenAI } from "@google/genai";
import type { GenerateVideoOptions } from '../types';

// Removed conflicting and unused global Window interface declaration for `window.aistudio` to resolve a TypeScript error. The correct global type is defined in `App.tsx`.
const loadingMessages = [
  "Summoning digital spirits...",
  "Painting with light and code...",
  "Rendering keyframes of imagination...",
  "Composing the digital orchestra...",
  "This can take a few minutes, hang tight!",
  "Weaving pixels into a story...",
  "The AI is dreaming up your anime...",
  "Assembling the animation cell by cell...",
  "Finalizing the color palette...",
];

export const generateAnimeVideo = async (
  options: GenerateVideoOptions,
  setLoadingMessage: (message: string) => void
): Promise<Blob> => {
  // IMPORTANT: Create a new GoogleGenAI instance for each request to ensure the latest API key is used.
  if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  setLoadingMessage("Initializing video generation...");

  let operation = await ai.models.generateVideos({
    model: options.model,
    prompt: options.prompt,
    config: {
      numberOfVideos: 1,
      resolution: options.resolution,
      aspectRatio: options.aspectRatio,
    },
  });

  let messageIndex = 0;
  const interval = setInterval(() => {
    setLoadingMessage(loadingMessages[messageIndex]);
    messageIndex = (messageIndex + 1) % loadingMessages.length;
  }, 5000);

  setLoadingMessage("Generation in progress... This may take several minutes.");

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (e) {
        clearInterval(interval);
        throw e;
    }
  }
  
  clearInterval(interval);
  setLoadingMessage("Finalizing video...");

  if (operation.error) {
    throw new Error(`Operation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Video generation succeeded, but no download link was provided.");
  }

  setLoadingMessage("Downloading generated video...");
  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  return response.blob();
};
