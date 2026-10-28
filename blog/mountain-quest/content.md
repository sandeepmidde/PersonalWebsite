# Understanding RAG Pipelines
Subtitle: Hanuman has until dawn to find one healing herb on a mountain of thousands.
Story: 🏔️ The Mountain Quest · Hanuman
Tags: AI, Technical, RAG
Series: Tarang Tales
Date: 2026-10-02
Summary: How an AI finds the right facts first and then answers from them, told through a race against dawn.

## New Joiner

It is your first day at a new job. A colleague stops at your desk.

"Quick question. How many weeks of leave do new parents get here?"

You have never read the company handbook. You could guess. You might even sound sure.

Or you could open the handbook, find the right page, and answer from it.

An AI on its own often guesses. To make it look things up first, engineers build a fetch-then-answer system.

To see how it works, we go to a battlefield in the **Ramayana**.

New to the series? Start with [how search understands meaning](posts/the-arjuna-algorithm/) and [how it finds things fast](posts/ultimate-cosmic-race/).

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

He does not wander the whole slope. He remembers what the physician described, and looks only for plants that match.

But time is running out. The sky is turning grey.

So Hanuman makes a choice. He grips the ridge where the matching herbs grow, tears it free, and lifts it into the sky.

![From mountain to medicine](blueprint.svg)

## Back at the Tent

Hanuman lands before the medical tent and sets the ridge down. Rock, mud and roots spill everywhere.

Sushena does not look at the whole heap. He kneels, sorts through it and picks out the exact leaves he needs. He grinds them, prepares the medicine and gives it to Lakshmana.

The first light touches the sky. The prince opens his eyes.

## Who Did What

**The mountain held the cure** all along, hidden among thousands of plants. In an AI system, this is your company's knowledge. Handbooks, policies, manuals.

**Hanuman fetched, but never healed.** He found the right part of the mountain and carried it back. In an AI system, a search step does this job. It finds the few pages that match the question.

**Sushena healed, but never left the tent.** He worked only from what was brought to him. In an AI system, this is the AI that writes the answer. It answers from the fetched pages, not from memory.

Engineers call this fetch-then-answer design **RAG**, short for Retrieval-Augmented Generation. Retrieval is Hanuman. Generation is Sushena.

Just as you would open the handbook before answering your colleague.

## Building the Quest

So engineers build the system in three steps.

**First, prepare the mountain.** All the documents are cut into small pieces, a paragraph or so each, and stored so they can be searched by meaning.

![Preparing the knowledge](ingestion.svg "aside")

**Then, fetch.** When a question arrives, the search step brings back the few pieces closest to it. Like the ridge, it brings a little extra, so the right piece is surely inside.

**Finally, answer.** The pieces are placed in front of the AI along with the question. It picks out what is relevant and writes the answer.

![Fetching the closest matches](retrieval.svg "aside")

## Story to System

| In the story | In a RAG system |
|---|---|
| Mount Dronagiri and its plants | The company's documents, cut into pieces |
| "Find the Sanjeevani herb" | The user's question |
| Hanuman lifting the ridge | Fetching the closest pieces, with a little extra |
| Sushena picking the right leaves | The AI using only what is relevant |
| Lakshmana wakes at dawn | A correct answer, grounded in the documents |

## See It Work

The colleague's question reaches the company's AI assistant. *"How many weeks of leave do new parents get?"*

1. **Fetch.** The search step brings back five pieces of the handbook. One is the parental leave section. Two are about who qualifies. Two are about sick leave.
2. **Read.** The AI reads all five and sets the sick leave pieces aside.
3. **Answer.** *"New parents get 26 weeks of paid leave after six months of service. See the HR Handbook, section 7.2."*

No guess. The answer came from the page.

![Writing the answer from the fetched pages](generation.svg "aside")

## Where the Story Stops

Hanuman could carry a whole ridge. An AI can only read a little at a time, so the search brings a handful of pieces, not everything. That limit has [its own story](posts/context-window-limits/).

And if the herb was never on the mountain, no one can fetch it. The answers are only as good as the documents behind them.

## Takeaway

On your first day, you would not guess. You would open the handbook.

Make the AI do the same. Fetch the facts first, then answer.

> First find the herb. Then heal.
