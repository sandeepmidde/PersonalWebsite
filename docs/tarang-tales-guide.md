# Tarang Tales Writing Guide

How every Tarang Tale is written. Follow it for each new topic, and append to
it (see [Change log](#change-log)) whenever a review settles a new rule.

The reference Tale is **Optimizing Context Windows**
(`blog/context-window-limits/content.md`). When in doubt, copy its shape.

---

## 1. Who the reader is

A complete newcomer to computer technology. Someone who reads Tinkle or the
Jataka tales, not a white paper.

They should finish the Tale able to explain the concept to a friend using the
story alone. If the story could be deleted and the lesson would still make
sense, the story was decoration. Rewrite it.

**Test before publishing:** read only the story sections. Can you guess the
concept? Then read only the tech sections. Do they keep pointing back to a
story moment? Both answers must be yes.

---

## 2. Front matter

```
# <Concept Title>
Subtitle: <one-line story glimpse>
Story: <emoji> <Story Name> · <Hero>
Tags: AI, Technical
Series: Tarang Tales
Date: YYYY-MM-DD
Summary: <what the reader will understand, in plain words>
```

| Line | Rule | Good | Bad |
|---|---|---|---|
| Title | Concept first, fits one line on the card (about 28 characters) | Optimizing Context Windows | Optimizing Context Window Limits (wraps) |
| Subtitle | A glimpse of the story, not the tech. Shows on the card and post header | A storm too big for any village, and a hill lifted overhead so everyone gets a dry place to stand. | How to Prevent AI Brain Fog when Reading Massive Data |
| Story | Emoji, story name, hero | ⛰️ Lifting Govardhan · Krishna | Krishna |
| Summary | Plain promise of what is learned | Why an AI cannot read everything at once, and how it is handed just the right part | Context window optimization via chunking and paging |

Check the card title on `/tales/` before publishing. If it wraps, shorten it.

---

## 3. Section layout, in this order

| # | Section | Purpose | Length |
|---|---|---|---|
| 1 | **Hook** (e.g. "One Small Question") | An everyday problem a newcomer can picture | 4 to 6 short lines |
| 2 | **Story, in 2 to 4 scenes** | The myth, told as a living story | Most of the post |
| 3 | **Reveal** (e.g. "What Krishna Really Did") | Each story element becomes one part of the concept | Short paragraphs |
| 4 | **How systems do it** (e.g. "Living Under the Hill") | The method, still in story language | Short paragraphs or a numbered list |
| 5 | **Story to System** | Table, story moment to tech meaning | 4 to 6 rows |
| 6 | **See It Work** | One worked example from real life | 3 to 5 numbered steps |
| 7 | **Where the Story Stops** | Where the comparison breaks, said simply | 2 to 4 short lines |
| 8 | **Takeaway** | Callback to the hook, one plain lesson | 2 to 3 lines |
| 9 | **Moral** (blockquote `>`) | One line, about the concept | One sentence |

Two diagrams per Tale, placed beside the story climax and the method
section, using `![alt](file.svg "aside")`.

---

## 4. Hook rules

Start from something the reader already knows from daily life or from the
story world itself. No technical terms, no numbers.

**Good** (Context Windows)
> Someone asks you, *"Who built the bridge to Lanka?"*
> The whole Ramayana lies open in front of you. Would you read it aloud from page one until you reach the bridge?

**Bad**
> Every language model has a context window measured in tokens. A large window holds about 128,000 tokens, roughly 300 pages.

Why it fails: a newcomer cannot tell whether 300 pages is big or small, and
"tokens" means nothing yet.

Other good hooks already in the series: a help-page search that misses the
obvious answer (Semantic Search), a confident wrong revenue figure
(Hallucinations), a model too big for one machine told without numbers first.

End the hook with one line that hands over to the story.
> So how do engineers keep an AI from drowning in words? The answer is in a story about a storm.

---

## 5. Story and narration rules

**Tell it as a story, not a summary.**

- Short sentences. One idea per sentence. Many one-line paragraphs.
- Give characters voices. Dialogue in quotes.
- Build the scene with sounds and sights, then the drama, then the climax.
- Each scene gets its own heading (Boy Who Questioned the Sky, Indra's Rage, Krishna Lifts Govardhan).
- Bold a name the first time it appears.

**Good**
> Far above, on his throne in the sky, Indra saw the empty altar.
> His face darkened.
> "A cowherd boy tells them to forget me? Then let them remember me. Send the clouds. All of them."

**Bad**
> Angered by the villagers' sudden shift in devotion, Indra, the god of rain, unleashed a catastrophic tempest upon Vrindavan for seven days and seven nights.

**Every story beat must carry a piece of the concept.** Pick the story
because its *mechanism* matches the concept, not just its mood.

| Tale | Story mechanism | Concept mechanism |
|---|---|---|
| Semantic Search | Arjuna aims at the fish's reflection, not the fish | Search compares embeddings, not raw text |
| Prompt Engineering | Betal's two rules contradict, Vikram fails 24 times, escapes when he truly does not know | Conflicting prompt rules force guesses, a safe "I don't know" path fixes it |
| Vector Databases | Ganesha circles his parents, who stand for the universe | The index checks a few representatives instead of every item |
| Fine-Tuning vs RAG | Eklavya's clay statue never learns Drona's new techniques | A fine-tuned model's facts are frozen at training time |
| Context Windows | Krishna puts the hill between the rain and the people | A search step lets only the needed pieces reach the AI |

If no beat of the story matches how the concept *works*, choose a different story.

**Accuracy of the myth.** Keep to the well-known versions (Valmiki Ramayana,
Mahabharata, Bhagavata Purana, popular retellings). When a tale has more than
one telling, say so ("told in India of Tenali Raman and in China of Cao
Chong"). Check names against the sources before changing them. For example,
the Govardhan storm is sent by Indra, not Varuna. Invented details must be
framed as imagination ("Now picture this").

---

## 6. Reveal rules

Map story elements to concept parts **in prose**, one short paragraph each,
starting with the story element in bold. Never a dictionary-style bullet list.

**Good**
> **The dry space under the hill** is how much the AI can hold at one time. Engineers call this its **context window**. Like the space under the hill, it has edges.

**Rules**

- Introduce each technical term **once**, after the story, right next to the story element it matches.
- Every mapping must be obviously true to a newcomer. If it needs explaining twice, it is the wrong mapping.
  - Bad: "The hill is a separate store that holds everything. It takes the weight of the storm, so the AI never has to." (A hill does not store rain. Readers were confused.)
  - Good: "The hill is a search step that stands between all that information and the AI. Everything lands on it first. It lets through only the few pieces the question needs."
- Close the reveal by pointing back to the hook ("Just as you turned to the one chapter about the bridge").

---

## 7. Story to System table

Two columns, "In the story" and "In <the concept>". Four to six rows. Each
cell short, under about eight words. Use the same mappings as the reveal, no
new ones.

---

## 8. See It Work

One example from ordinary work life (a bank, a help centre, an HR handbook).
Three to five numbered steps, each with a bold verb label.

- Use small, picturable quantities ("120 small bundles, one per month") rather than sizes a newcomer cannot judge ("128,000 tokens", "1,000 pages").
- Illustrative numbers are fine if they are called illustrative.
- End with one line that echoes the story ("It drank one cup at a time").

---

## 9. Where the Story Stops

State where the comparison breaks down, honestly and simply.

**Good**
> Krishna's hill kept out every drop. Reading one piece at a time has a small gap.
> The AI sees only one month at a time. So it may not notice that a problem from January came back in December.

**Bad**
> Krishna's shelter was perfect. This method is not. When the AI reads one month at a time, it can miss a link between something in the third month and something years later.

Avoid putting the method down ("this method is not"). Name the gap and how it
is reduced.

---

## 10. Takeaway and moral

- **Takeaway:** call back to the hook, then one plain line of advice. No meta lines such as "AI is the same", no new metaphors (a "bigger desk" confused readers).
  > You did not need the whole Ramayana to answer one question. You needed the right page.
  > Give the AI the right page, not the whole book.
- **Moral:** one line, about the **concept**, not just the myth.
  - Good: "The window is small. Fill it with what matters."
  - Weak: "You cannot stop the storm. You can decide where it lands." (true to the story, but not clearly about context windows)

---

## 11. Diagrams and cover

- **Diagrams** use the Tales palette: cream `#FFF7E6` card, ink `#1F1147` border, amber caps label `#D97706`, pink `#DB2777`, violet `#7C3AED`, green `#15803D` for good paths, red `#DC2626` for bad paths. Width 400.
- Diagrams explain the **concept in plain words**. Do not label boxes with story metaphors the reader must decode ("Hill overhead" confused readers). A small italic footer line may tie back to the story ("like the hill, only what is needed gets through").
- No jargon in labels ("what the AI can hold", not "context window").
- Keep text inside its box. Check at real size on the post page.
- **Cover:** original comic-style SVG art, 1200×627, thick ink border, a tilted yellow banner with the story name in caps. Render to `cover.png` (1200×627) and `cover.webp` (800×418).

---

## 12. Always omit

- Technical terms, numbers or acronyms in the hook.
- Long sentences with several clauses. Split them.
- Textbook-summary storytelling with no scenes or voices.
- Dictionary-style bullet lists in the reveal.
- Mappings that need a second explanation.
- Overclaims: "deterministic", "zero hallucination", "guarantee", "never crashes", "infinite". Claims must match what the technology really does.
- Puns or side sections that do not teach the concept (the old "Raga" section in Semantic Search).
- Site-wide punctuation rules: no em or en dashes, no semicolons, no "Label:" colons in sentences. Headings never start with "The" and have no colons.

## 13. Always include

- A hook a newcomer can picture.
- The story in scenes, with dialogue.
- A reveal where each story element maps to one concept part.
- The Story to System table.
- A worked example in plain quantities.
- An honest "Where the Story Stops".
- A takeaway that calls back to the hook, and a moral about the concept.
- Links to related Tales where they help (`[RAG](posts/mountain-quest/)`).

## 14. Pre-publish checklist

1. Card title fits one line on `/tales/`.
2. Hook has no jargon and no numbers.
3. Story-only read hints at the concept. Tech-only read keeps pointing to the story.
4. Each technical term appears first in the reveal, beside its story element.
5. No sentence needs a second read.
6. Diagram labels are plain words and fit their boxes.
7. Punctuation rules pass (no dashes, semicolons, label colons).
8. Myth names and events match the known sources.

---

## Change log

Append new rules here with the date and what prompted them. Then update the
relevant section above.

- **2026-10-28** Guide created from review of all eight Tales.
  - Stories must explain the mechanism, not just decorate ("a user shouldn't feel the story was made just for namesake").
  - Narration must be a real story with short lines and dialogue.
  - Hooks for newcomers. No tokens, page counts or context-window talk up front. Example hook, the Ramayana bridge question.
  - Govardhan review. Rename vague scene headings ("Hill in the Sky" became "Krishna Lifts Govardhan"). Diagrams must not use decode-the-metaphor labels ("Hill overhead"). The hill maps to a search step, not a store. "Where the Story Stops" names the gap simply, without "this method is not". Takeaway drops meta lines ("AI is the same") and new metaphors ("a bigger desk"). Moral must be about the concept.
