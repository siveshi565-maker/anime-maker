
import React, { useState } from 'react';
import type { GenerateVideoOptions, VeoModel, AspectRatio, Resolution } from '../types';

interface VideoGeneratorFormProps {
  onGenerate: (options: GenerateVideoOptions) => void;
  isLoading: boolean;
}

const VideoGeneratorForm: React.FC<VideoGeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('A stylish anime character walking through a neon-lit futuristic city in the rain, lofi style.');
  const [model, setModel] = useState<VeoModel>('veo-3.1-fast-generate-preview');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate({ prompt, model, aspectRatio, resolution });
    }
  };
  
  const FormLabel: React.FC<{ children: React.ReactNode; htmlFor: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-400 mb-2">{children}</label>
  );

  const RadioButton: React.FC<{ id: string; name: string; value: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string }> = ({ id, name, value, checked, onChange, label }) => (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="block cursor-pointer rounded-lg border border-gray-600 bg-gray-700/50 p-2 text-center text-sm font-medium transition-colors peer-checked:border-purple-500 peer-checked:bg-purple-600/20 peer-checked:text-purple-300 hover:bg-gray-600/50"
      >
        {label}
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <FormLabel htmlFor="prompt">
          Your Anime Scene
        </FormLabel>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A samurai dueling under a cherry blossom tree"
          rows={5}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
          required
        />
      </div>

      <div>
        <FormLabel htmlFor="model">Model</FormLabel>
        <div className="grid grid-cols-2 gap-2">
            <RadioButton id="veo-fast" name="model" value="veo-3.1-fast-generate-preview" checked={model === 'veo-3.1-fast-generate-preview'} onChange={(e) => setModel(e.target.value as VeoModel)} label="Veo 3.1 Fast"/>
            <RadioButton id="veo-hq" name="model" value="veo-3.1-generate-preview" checked={model === 'veo-3.1-generate-preview'} onChange={(e) => setModel(e.target.value as VeoModel)} label="Veo 3.1 HQ"/>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FormLabel htmlFor="aspectRatio">Aspect Ratio</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <RadioButton id="ar-16-9" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} label="16:9"/>
            <RadioButton id="ar-9-16" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} label="9:16"/>
          </div>
        </div>

        <div>
          <FormLabel htmlFor="resolution">Resolution</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <RadioButton id="res-720" name="resolution" value="720p" checked={resolution === '720p'} onChange={(e) => setResolution(e.target.value as Resolution)} label="720p"/>
            <RadioButton id="res-1080" name="resolution" value="1080p" checked={resolution === '1080p'} onChange={(e) => setResolution(e.target.value as Resolution)} label="1080p"/>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Animating...
          </>
        ) : (
          'Animate!'
        )}
      </button>
    </form>
  );
};

export default VideoGeneratorForm;
