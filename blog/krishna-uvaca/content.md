# Kṛṣṇa Uvāca, Designing Trust in the Age of Generative AI
Tags: Projects, AI
Date: 2026-09-30
Summary: Behind the code of how an unexpected question from my child forced a complete rethink of conversational RAG architecture and retrieval metrics.

> "Building software is often the easier part. Building something people genuinely trust is much harder."

## The question that exposed a gap

Some questions stay with you long after they have been asked.

One evening, my child came to me worried about a friendship. To me, it felt like one of those childhood anxieties that time quietly heals. To my child, it was the entire world. Almost instinctively, I reached for grounded comfort.

*"You know... Krishna once spoke about something exactly like this to Arjuna on the battlefield..."*

And then I stopped. I couldn't remember what the text actually said.

That moment stayed with me. After nearly two decades of leading technology transformations and anchoring complex systems in highly regulated environments, I faced an uncomfortable truth. I had built high-availability infrastructure to solve large business problems, but I had no reliable way to access the one body of knowledge I most wanted to understand.

So I built one.

Over a sprint of intensive R&D, I engineered **Kṛṣṇa Uvāca**, a live conversational retrieval-augmented generation (RAG) platform. The intent was simple. Build an MVP that lets people bring real, modern-day dilemmas to the Bhagavad Gita and receive context-aware answers grounded in the text itself.

What surprised me wasn't the mechanics of building it. It was the product thinking and the ethical trade-offs hiding just beneath the surface.

## From execution to governance, designing silence

In a standard enterprise tool, the engineering goal is usually throughput. The system should always respond. But with sacred texts, historical records or high-compliance legal material, the cost of a wrong answer is severe.

I quickly realized I wasn't just configuring API endpoints. I was designing an infrastructure of trust, and I had to solve the same problems corporate technology teams face every day.

- **When is silence better than confidence?** Asked something outside its source material, a standard language model will confidently invent an answer. I built guardrails that make the system say *"I don't know"* instead.
- **How much context is enough?** Pushing an entire chapter into the prompt adds noise and drives up latency and token cost. The architecture had to retrieve the precise passages that matter while keeping the conversational thread intact.
- **How do you stay authentic without sounding mechanical?** The system needed to feel human while staying anchored to the primary text, with every answer citing the verses it draws on.

## The composable architecture blueprint

To avoid the overhead of a long, monolithic build, I took a **composable enterprise approach**. AI-augmented engineering workflows and low-code middleware prioritized speed to value without compromising clear system boundaries.

### System orchestration pipeline

```
[ User question ]
        │
        ▼
[ Dify orchestration · multi-turn state ]
        │
        ├──► [ Grounded retrieval · source verses ]
        │
        ▼
[ Context filter · hallucination guardrails ]
        │
        ▼
[ Cited answer with verse references ] ──► [ Softr web front end ]
```

Separating the presentation layer from the orchestration loop keeps the architecture modular.

- **Orchestration hub (Dify and Make.com).** Governs conversational routes, multi-turn memory and conditional API logic.
- **Data layer (Airtable).** A structured, searchable store for the application's records.
- **Interface (Softr).** Renders a clean, accessible front end, backed by FastAPI services.

## The trade-off matrix

No architecture is perfect. Every one is a set of calculated trade-offs. To move the MVP toward production-grade verification, I built the evaluation harness first, so user experience could be measured against data fidelity before any production spend.

| Dimension | The tactical choice | The strategic trade-off |
|---|---|---|
| **Data integrity** | Strict context grounding | The system refuses to answer when a question falls outside its source texts |
| **Factual attestation** | Verse-level citation on every answer | More upfront configuration so every answer can be checked |
| **Delivery velocity** | Composable low-code middleware | Less raw code flexibility in exchange for a live MVP in days instead of months |
| **Conversational state** | A constrained memory window | Tight topical focus, with token growth and latency kept in check |

## Where the benchmarks stand today

Across 500 evaluated test conversations, Kṛṣṇa Uvāca reached **88% verified accuracy**. Just as important, questions outside the source texts are refused rather than answered, so the remaining misses are gaps in coverage, not confident invention.

The project proves a principle that matters for modern technology delivery. High-fidelity AI applications do not need heavy, high-overhead custom builds. Anchor the delivery strategy on composable architecture, strict guardrails and verifiable citations, and you can ship trusted systems quickly.

## What's next on the roadmap

This is the opening chapter. In upcoming posts I'll break down the following.

1. **Part 2.** The prompt engineering that governs the model's tone and its refusal thresholds.
2. **Part 3.** Layering hybrid search to sharpen retrieval across complex passages.

The live application is public. I'd genuinely value your perspective on the implementation.

**[Explore the live system at krsna.sandeepmidde.com](https://krsna.sandeepmidde.com/)**
