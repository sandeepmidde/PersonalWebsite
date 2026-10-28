# Optimizing Context Windows
Subtitle: A storm too big for any village, and a hill lifted overhead so everyone gets a dry place to stand.
Story: ⛰️ Lifting Govardhan · Krishna
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: Why every language model can read only so much at once, and how storage, chunking and running notes let it handle far more.

## Model's Desk

Picture a language model working at a desk.

Everything it uses for one answer must fit on that desk. Your question. The documents you attach. The conversation so far. Even the answer it is writing.

That desk is the **context window**. It is measured in **tokens**, small pieces of words. A large window today holds about 128,000 tokens. That is roughly 300 pages.

Now try to drop a 1,000-page archive on it. It will not fit. The request is rejected, or the text is cut off. Even when it fits, the model pays less attention to pages buried in the middle. Researchers call this **lost in the middle**.

So how do real systems handle a flood of data? We go to a village in a storm.

## Angry Sky

Vrindavan. A village of cowherds, green pastures and one gentle hill called **Govardhan**.

Every year the villagers make a grand offering to **Indra**, king of the gods and lord of the rain.

This year, young **Krishna** asks his father a question.

"Why do we worship Indra? It is Govardhan that gives our cows grass. Its streams give us water. Let us honour the hill instead."

The village agrees. The offering goes to Govardhan.

High above, Indra is furious.

"They forget who sends their rain? Then let them have rain."

The sky turns black. Thunder cracks. And the downpour begins.

## Seven Days of Rain

The rain does not stop. Not for an hour. Not for a day.

Streets turn to rivers. Roofs give way. Calves cry in the flooding sheds.

The villagers run to Krishna. "Save us!"

Krishna walks to Govardhan. He bends, slips one hand beneath the hill, and lifts.

The whole hill rises into the sky. He holds it up on the tip of his little finger, like an umbrella.

"Come," he says. "Bring the children. Bring the cows. There is room for everyone."

The people crowd beneath it. Above them, the storm pounds the hill. Water pours off its slopes in streams. Below, the ground stays dry.

For seven days and seven nights, they live under the hill. Each day, families care only for the small space around them. On the eighth day, Indra gives up. The sky clears.

![Everything at once, or a shield overhead](storm-shield.svg "aside")

## Krishna Never Stopped the Rain

Look at what Krishna did. And what he did not do.

He did not make the village bigger. He did not stop the storm. He changed **where the water landed**.

- **The rain** is your data. Ten years of logs. Thousands of transcripts. Far more than any desk can hold.
- **The dry space under the hill** is the context window. Fixed in size. Everything inside must fit.
- **The hill** takes the weight of the storm. In a system, this is the **storage layer**, a document store or vector database. It can hold any amount. The model never sees the whole flood.
- **The streams off the slopes** are what reaches the model. A steady, small flow. Only what is needed, a little at a time.
- **Seven days, one day at a time** is how long jobs are done. Not all at once. Piece by piece.

## How Systems Do It

1. **Store everything outside the model.** The full archive lives in storage, cut into small pieces called **chunks**.
2. **Bring in only what matters.** For a question, fetch just the few chunks that are relevant. This is the retrieval step of [RAG](posts/mountain-quest/).
3. **Work one page at a time.** For a big job, feed the model one chunk. Keep its result. Clear the desk. Bring the next.
4. **Carry notes forward.** A short running summary travels from chunk to chunk. So later pages still know what came before.

![One page at a time, with notes carried forward](paging-flow.svg "aside")

## Story to System

| In the story | In an AI system |
|---|---|
| Seven days of rain | More data than the model can read at once |
| Dry space under the hill | The context window, fixed in size |
| The hill taking the storm | A storage layer that holds everything |
| Streams running off the slopes | Small chunks fed in, a few at a time |
| Living one day at a time | Processing page by page, with running notes |

## See It Work

A bank wants a summary of ten years of complaint logs. That is about 1,000 pages. Five times too big for the desk.

1. **Split.** The logs are cut into 120 chunks, one per month.
2. **Summarise each.** The model reads one month at a time and writes a 300-word summary.
3. **Combine.** The 120 summaries add up to about 36,000 words. That fits on the desk.
4. **Summarise the summaries.** The model reads them all and writes the final ten-year view.

The desk never overflowed. Not once.

## Where the Story Stops

Krishna's shield was perfect. Page-by-page reading is not.

When the model sees one month at a time, it can miss a link between month 3 and month 98. Overlapping chunks, good running notes and smart retrieval narrow that gap. Bigger windows help too. But the question stays the same. What does the model need to see right now?

## Takeaway

A bigger desk is like a bigger roof. Useful, but never enough for every storm.

The lasting fix is design. A store that holds everything, and a steady stream that brings the model just what it needs.

> You cannot stop the storm. You can decide where it lands.
