 Gateway Approach for Direct LLM Access

  Architecture Overview

  Your setup uses a dual-mode gateway with ngrok tunneling:

  1. Local Mode - Direct Ollama/OpenAI-compatible API
  2. JBChat Mode - Remote backend with RAG capabilities

  Key Endpoints

  Ollama API (Local LLM)
  Base URL: http://localhost:11434 (or ngrok tunnel)

  POST /api/generate     - Text completions (streaming)
  POST /api/chat         - Vision/chat models (multi-modal)
  GET  /api/tags         - List available models
  POST /api/embeddings   - Generate embeddings

  OpenAI-Compatible Mode
  POST /v1/chat/completions

  Authentication Pattern

  Map<String, String> headers = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'ngrok-skip-browser-warning': 'true',  // Bypass ngrok interstitial
  };

  Request Format (Ollama)

  {
    "model": "gpt-oss:120b",
    "prompt": "your prompt here",
    "stream": true,
    "options": {
      "num_ctx": 32000
    }
  }

  Streaming Response Handling

  await for (var chunk in response.stream.transform(utf8.decoder)) {
    final lines = chunk.split('\n');
    for (var line in lines) {
      final json = jsonDecode(line);
      yield json['response'];  // Extract response text
      if (json['done'] == true) break;
    }
  }

  ngrok Tunnel Setup

  Exposes local Ollama server for remote access:
  - Provides HTTPS without server config
  - URL format: https://[subdomain].ngrok-free.dev
  - Add ngrok-skip-browser-warning: true header to bypass free-tier warning page

  Key Configuration Points

  | Setting        | Storage           | Purpose                  |
  |----------------|-------------------|--------------------------|
  | API Endpoint   | SharedPreferences | Base URL for LLM         |
  | API Key        | SharedPreferences | Authentication           |
  | API Mode       | SharedPreferences | ollama or openai         |
  | Model Name     | SharedPreferences | Default model            |
  | Context Length | Per-model config  | Max tokens (32K default) |

  To Replicate in Another Project

  1. Set up ngrok tunnel to your spark server's Ollama instance
  2. Configure base URL - localhost for local dev, ngrok URL for remote
  3. Use /api/generate for text, /api/chat for vision models
  4. Handle streaming - parse line-by-line JSON responses
  5. Add ngrok header to bypass browser warning on free tier

  Reference Files

  - lib/services/llm_service.dart - Core LLM communication
  - lib/services/settings_service.dart - Configuration management
  - NGROK_API_ENDPOINT.md - ngrok setup documentation