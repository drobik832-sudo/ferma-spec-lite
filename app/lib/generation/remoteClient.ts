import { GenerateRequest, GenerateResponse, GenerationMode } from './types';

export class RemoteGenerationClient {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_REMOTE_API_URL || '';
    this.apiKey = process.env.NEXT_PUBLIC_REMOTE_API_KEY || '';
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        imageUrl: data.imageUrl,
        success: true,
      };
    } catch (error) {
      console.error('Remote generation error:', error);
      return {
        imageUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  isConfigured(): boolean {
    return !!this.apiUrl && !!this.apiKey;
  }
}

export const remoteClient = new RemoteGenerationClient();
