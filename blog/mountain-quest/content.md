# Understanding RAG Pipelines
Subtitle: Hanuman has until dawn to find one healing herb on a mountain of thousands.
Story: 🏔️ The Mountain Quest · Hanuman
Tags: AI, Technical, RAG
Series: Tarang Tales
Date: 2026-10-02
Summary: How a RAG pipeline stores knowledge, fetches the right pieces and writes an answer from them, told through a race against dawn.

## Guessing Problem

Ask a language model about your company's leave policy. It has never read it.

So it guesses. The answer sounds right. It is wrong. This is a **hallucination**.

**RAG**, or Retrieval-Augmented Generation, stops the guessing. It finds the right facts first, then lets the model answer from them.

To see each step, we go to a battlefield in the **Ramayana**.

New to the series? Start with [how semantic search works](posts/the-arjuna-algorithm/) and [how vector databases find things fast](posts/ultimate-cosmic-race/).

## Night on the Battlefield

Night falls on Lanka. **Lakshmana** lies still, struck down by a powerful weapon.

**Rama** kneels beside his brother. He turns to the royal physician, **Sushena**.

"Can he be saved?"

Sushena checks the prince's pulse. "Only one herb can heal him. **Sanjeevani**. It grows on **Mount Dronagiri**, far to the north, in the Himalayas."

"How long do we have?"

"Until dawn. Not a moment more."

Every eye turns to **Hanuman**.

## Mountain of Thousands

Hanuman flies through the night and lands on Dronagiri.

He stares. The mountain is covered in plants. Thousands of them. Shrubs, vines, roots, flowers. Many glow faintly in the dark.

Which one is Sanjeevani?

He does not wander the whole slope. He remembers what the physician said, and looks only for plants that match that description.

The search is slow. Dawn is coming. So Hanuman makes a choice.

He grips the ridge where the matching herbs grow, tears it free, and lifts it into the sky.

![The pipeline from mountain to medicine](blueprint.svg)

## Back at the Tent

Hanuman lands before the medical tent and sets the ridge down. Rock, mud and roots spill everywhere.

Sushena does not look at the whole heap. He kneels, sorts through it and picks out the exact leaves he needs. He grinds them, prepares the medicine and gives it to Lakshmana.

Before sunrise, the prince opens his eyes.

## Three Steps of the Quest

Look again at who did what.

- **The mountain held the knowledge.** It was there all along, mixed with thousands of other things.
- **Hanuman fetched.** He did not heal anyone. He found the right part of the mountain and carried it back.
- **Sushena healed.** He never left the tent. He worked only from what was brought to him.

A RAG pipeline splits the work the same way.

1. **Store the knowledge.** Documents are cut into small pieces called **chunks**. Each chunk gets an **embedding**, its meaning as numbers. All of it goes into a **vector database**. This is the mountain.
2. **Retrieve.** A question arrives. The **retriever** turns it into an embedding and fetches the closest chunks. Like the ridge, it brings back a few extra, so the right one is surely inside. This is Hanuman.
3. **Generate.** The chunks are placed in front of the language model with the question. It writes the answer from them, not from memory. This is Sushena.

![Ingestion turns raw files into a map of meaning](ingestion.svg "aside")

## Story to System

| In the story | In a RAG pipeline |
|---|---|
| Mount Dronagiri and its plants | Documents, chunked and stored in a vector database |
| "Find the Sanjeevani herb" | The user's question |
| Looking only for plants that match | Retrieval by meaning, not keywords |
| Lifting the ridge, not one leaf | Fetching the top few chunks, with spare context |
| Sushena picking the right leaves | The language model using only what is relevant |
| Lakshmana wakes before dawn | A grounded answer, in seconds |

## See It Work

An employee asks, *"How many weeks of parental leave do I get?"*

1. **Store.** The 400-page HR handbook was cut into 1,200 chunks last month. Each one was embedded and stored.
2. **Retrieve.** The question is embedded. The five closest chunks come back. One is the parental leave section. Two are its neighbours, about eligibility. Two are about sick leave.
3. **Generate.** The model reads all five. It ignores the sick leave chunks. It answers, *"You get 26 weeks of paid parental leave after six months of service (HR Handbook, section 7.2)."*

![The retriever lifts the closest matches](retrieval.svg "aside")

## Where the Story Stops

Hanuman lifted a whole ridge. A language model cannot read a whole mountain. It has a limit on how much text it can take in at once, its **context window**. So retrievers bring back a handful of chunks, not everything. That limit has [its own story](posts/context-window-limits/).

And if the herb is not on the mountain, no retriever can find it. RAG is only as good as the documents behind it.

![The LLM turns retrieved passages into an answer](generation.svg "aside")

## Takeaway

The physician never climbed the mountain. The messenger never healed anyone. Each did one job well.

That is RAG. One part finds. One part answers.

> Map the mountain, lift what matters, and let the physician do the healing.
