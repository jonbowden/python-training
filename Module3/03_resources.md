# Module 3 Additional Resources

## LLM Gateway Access

### How This Module Works
All LLM access in this module uses a **gateway abstraction** — a centralised HTTPS endpoint that handles authentication, rate limiting, and model routing. This mirrors enterprise practice.

**You will receive from your instructor:**
- `LLM_BASE_URL` — an ngrok HTTPS URL
- `LLM_API_KEY` — optional authentication token

### Models Used in This Module
- **phi3:mini** - Microsoft's compact model (mandatory)
- **llama3.2:1b** - Meta's efficient small model (optional comparison)

---

## Official Documentation

### API References
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md) - Endpoint specifications (we use `/api/chat`)
- [Python Requests Library](https://requests.readthedocs.io/) - HTTP for Humans
- [ngrok Documentation](https://ngrok.com/docs) - Secure tunnelling for HTTPS access

### Enterprise AI Concepts
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering) - Prompt engineering guide
- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) - Claude-specific techniques

---

## Video Tutorials

### LLM Fundamentals
- [But what is a GPT? Visual intro to transformers](https://www.youtube.com/watch?v=wjZofJX0v4M) - 3Blue1Brown
- [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) - Andrej Karpathy

### Ollama Setup
- [Run LLMs Locally with Ollama](https://www.youtube.com/watch?v=k_1pOF1mj8k) - Getting started guide
- [Ollama Tutorial](https://www.youtube.com/watch?v=90ozfdsQOKo) - Comprehensive walkthrough

---

## Further Reading

### Enterprise AI Safety
- [AI Alignment Research](https://www.anthropic.com/research) - Anthropic's safety research
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) - Risk management standards

### Hallucinations and Reliability
- [Survey of Hallucination in NLG](https://arxiv.org/abs/2202.03629) - Academic paper on hallucinations
- [Factuality in LLMs](https://arxiv.org/abs/2310.07521) - Research on accuracy

---

## Practice Platforms

- [LangChain](https://www.langchain.com/) - Framework for LLM applications
- [LlamaIndex](https://www.llamaindex.ai/) - Data framework for LLM apps
- [HuggingFace](https://huggingface.co/) - Model hub and experimentation

---

## Preparing for Module 4 (RAG)

Module 4 will cover Retrieval-Augmented Generation (RAG). To prepare:

1. **Understand embeddings** - How text is converted to vectors
2. **Learn about vector databases** - FAISS, Chroma, Pinecone
3. **Review chunking strategies** - How to split documents for retrieval

### Preview Resources
- [RAG Explained](https://www.youtube.com/watch?v=T-D1OfcDW1M) - Introduction to RAG
- [FAISS Documentation](https://faiss.ai/) - Facebook's vector search library
