# When an AI Should Say “I Don’t Know”
Tags: Projects, AI
Date: 2026-09-30
Summary: Building a RAG system taught me that reliable AI isn't just about finding the right answer. It's about knowing when the evidence isn't enough.

## The Spark

It started with a simple question at home. Someone wanted the exact reference to a particular piece of wisdom from the Bhagavad Gita. I knew the passage existed, but finding the exact reference meant manually digging back through the text to verify it.

That small moment exposed a much bigger problem. AI is exceptionally good at producing an answer. The much harder problem is knowing whether that answer is actually supported by the source.

That became the idea behind **Kṛṣṇa Uvāca**, a practical experiment in building a conversational AI system where the source, not the model's confidence, determines what can be said.

## The Real Problem Wasn't Retrieval

Retrieval-Augmented Generation (RAG) makes the basic workflow fairly simple. Pull relevant information from a trusted source and feed it to the language model as context. But retrieval alone isn't enough. A model can find relevant text and still invent details beyond it.

The system design focuses on three strict operational boundaries.

- **Strict source constraint.** Use only the available source context.
- **Factual attestation.** Show the exact verse behind the answer.
- **Calculated silence.** Do not answer when the source doesn't support one.

That last boundary became the most interesting engineering challenge. Generative AI is natively designed to produce text. This system needed to know precisely when not to produce it.

## Building It Lean

The goal wasn't to build a heavy AI platform. It was to test whether a generative experience could be made more dependable through architecture and guardrails rather than custom code bloat.

The solution uses a composable stack connecting Dify, Chroma, Airtable, Softr and Make.com like building blocks. Each component handles a specific part of the experience, from retrieval and orchestration to data management and presentation.

```
[ User question ]
        │
        ▼
[ Dify orchestration loop ] ──► [ Chroma and Airtable source cache ]
        │
        ▼
[ Context window and guardrails ]
        │
        ▼
[ Verified response OR "I don't know" ] ──► [ Softr web UI ]
```

The engineering decision was deliberate. Validate the system's behavior before investing in heavy infrastructure.

## Testing Failure

A system like this cannot only be tested with questions it is supposed to answer. It must be aggressively stress-tested with questions it shouldn't answer.

The evaluation harness intentionally included cases where the required information was entirely absent from the source text. The objective wasn't simply raw answer accuracy. It was determining whether the system could recognize when the evidence was insufficient and respond accordingly.

Across roughly 500 test conversations, run and rerun every time the prompts changed, about 88% of answers landed on relevant, correctly cited verses. The more telling result was on the other side. Whenever the answer wasn't in the text, the system said so instead of guessing. In all that testing, I didn't find a single invented verse or reference.

> Sometimes, the right AI response isn't a better answer. It's an honest "I don't know."

## The Takeaway

The deeper lesson from this experiment wasn't really about RAG workflows. It was about placing hard structural boundaries around a probabilistic technology.

- **The model** provides the intelligence.
- **The architecture** determines what information it can use.
- **The guardrails** define where it can go.

As AI moves into specialized enterprise environments, the goal cannot be to build systems that always force an answer. It must be to build systems that know when they have enough evidence to give one. That is the engineering principle Kṛṣṇa Uvāca was built to explore.

**[Explore the live sandbox at krsna.sandeepmidde.com](https://krsna.sandeepmidde.com/)**
