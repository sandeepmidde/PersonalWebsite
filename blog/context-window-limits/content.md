# Optimizing Context Windows
Subtitle: A storm too big for any village, and a hill lifted overhead so everyone gets a dry place to stand.
Story: ⛰️ Lifting Govardhan · Krishna
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: Why every language model can read only so much at once, and how storage, chunking and paging feed it far more than it can hold.

## Too Much at Once

Every large language model has a **context window**, the most text it can read and reason over in a single request. Your question, any documents you attach, the conversation so far and the answer it writes all have to fit inside it. The limit is counted in **tokens**, small pieces of words, and it exists because looking at more text costs more memory and more computation.

Drop a thousand-page document into a model with a small window and something has to give. The request is rejected as too long, the text is cut off, or the model reads it all but pays less attention to what is buried in the middle. Researchers call that last one **lost in the middle**.

To see how good systems handle a flood of data without drowning the model, we go to a village caught in a legendary storm.

## Storm Over Vrindavan

In the stories of **Krishna**'s childhood, the people of **Vrindavan** stop their yearly offering to **Indra**, god of rain, and honour **Govardhan Hill** instead, because it is the hill that feeds their cows. Indra is furious. He sends a storm that rages for seven days and seven nights.

No roof in the village could hold that much water. So young Krishna walks to Govardhan, lifts the whole hill and holds it overhead on one finger. The people, their children and their cattle shelter underneath, dry and safe, until Indra gives up.

Krishna never stops the rain. He changes where it lands.

![Everything at once, or a shield overhead](storm-shield.svg "aside")

## Downpour

The storm is a **massive data payload**. Ten years of financial logs, thousands of support transcripts, a full contract archive. Pour all of it straight into the prompt and the window overflows, just as the village would have flooded.

## Hill as a Storage Layer

Krishna does not try to catch every raindrop by hand. The hill takes the weight of the storm so the space beneath stays clear.

- **Keep the bulk outside the model.** The full data lives in a **storage tier**, such as a document store or a **vector database**, not in the prompt.
- **Bring in only what matters.** For each question, the system retrieves the few passages that are relevant and leaves the rest on the hill. This is the retrieval step of **RAG**, told in [Understanding RAG Pipelines](posts/mountain-quest/).

## Life Under the Hill

Beneath Govardhan, nobody deals with the whole storm. Each person only looks after the small, dry space in front of them, while the water runs off the sides in steady streams.

- **Chunking.** Long text is cut into pieces that fit the window, often with a little overlap so an idea split across a boundary is not lost.
- **Streaming one page at a time.** The application feeds the model one chunk, keeps the result, clears the space and brings in the next.
- **Carrying notes forward.** A short running summary travels from page to page, so later pages still know what came before. Summaries of summaries let the system digest a whole archive.
- **Memory paging.** Borrowed from operating systems, the idea is to keep what is needed now inside the window and page the rest out to storage, bringing it back when it is needed. Research systems such as **MemGPT** work this way.

![One page at a time, with notes carried forward](paging-flow.svg "aside")

## Where the Story Stops

Krishna's shield was perfect. Paging is not. When the model only ever sees one piece, it can miss a link between page 3 and page 300. Overlap, good summaries and smart retrieval narrow that gap, and bigger windows help, but the design question stays the same. What does the model need to see right now?

## Takeaway

A bigger window is like a bigger roof, useful but never enough for every storm. The lasting fix is architecture, a store that holds everything and a steady flow that hands the model just what it needs.

> You cannot stop the storm. You can decide where it lands.
