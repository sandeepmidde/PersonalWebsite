# Mechanics of Semantic Search
Subtitle: Looking only at its reflection in the water, Arjuna pierces the eye of a spinning fish.
Story: 🏹 The Archer's Target · Arjuna
Tags: AI, Technical, RAG
Series: Tarang Tales
Date: 2026-10-01
Summary: How AI search finds what you mean, not just the words you typed, told through two of Arjuna's archery tests.

## Problem with Words

You open a help page and type a question.

*"Money back for a broken blender."*

The search box returns a money-back offer on subscriptions. An article on back pain. A blender recipe.

The page you needed is called "Returns and refunds for damaged items". It never shows up. It does not share a single word with your question.

That is **keyword search**. It matches words. **Semantic search** matches meaning.

Two archery tests from the **Mahabharata** show how it works. The first shows *what* it looks for. The second shows *how* it finds it.

## First Test

Morning in the forest school. A wooden bird sits high in a tree.

The teacher **Drona** calls his students, one by one.

"Raise your bow," he says. "Now tell me. What do you see?"

**Yudhishthira** squints upward. "I see the tree. The branches. The bird. My brothers. And you, Guru."

"Lower your bow," says Drona.

The others answer the same way. Tree, leaves, sky, bird.

Then **Arjuna** steps up.

"What do you see?"

"The eye of the bird."

"Nothing else?"

"Only the eye."

"Shoot."

The arrow flies. It strikes the eye.

![What each kind of search sees](bird-test.svg "aside")

## What Drona Was Testing

Every question is full of words. Only one thing is the target.

- **Keyword search sees like Yudhishthira.** Every word counts the same. *Money*, *back*, *broken*, *blender*. Anything containing them comes back.
- **Semantic search sees like Arjuna.** It looks past the words to the intent. Here the intent is a refund for a damaged product. It aims only at that.

## Second Test

Years later. A royal hall, crowded with kings.

High on a pole, a wooden fish spins on a wheel. Below it lies a still pool of water.

The rule is simple. Pierce the fish's eye. But you may not look up. You may only look at its **reflection** in the pool.

Prince after prince tries. They glance at the water, the reflection wobbles, they shoot. They miss.

Arjuna kneels by the pool. He waits for the ripples to settle. The reflection grows sharp. He draws, aims at the image below, and sends the arrow upward.

It hits the eye of the real fish.

![Searching the reflection, not the fish](reflection.svg "aside")

## How Arjuna Aimed

Semantic search works the same way. It never compares your question with raw text. It compares **reflections**.

1. **Every passage gets a reflection.** Before anyone asks anything, each passage is turned into an **embedding**. That is a list of numbers that captures its meaning.
2. **The reflections sit in a pool.** All the embeddings are stored together in a **vector index**.
3. **Your question gets a reflection too.** It is turned into an embedding by the same model.
4. **Aim at the closest reflection.** The system finds the embeddings nearest to your question's.
5. **Hit the real fish.** Each reflection belongs to a real passage. So the system returns that passage.

Two more details from the story matter.

- **The fish spins, but its reflection stays put.** "Refund", "money back" and "return my order" sound different. They mean nearly the same. So their reflections land close together.
- **Still water gives a sharp image.** Ripples blur the reflection. Messy, overlong passages do the same to search. Clean, focused passages give sharper results.

## Story to System

| In the story | In semantic search |
|---|---|
| "What do you see?" | Working out the intent of a question |
| Tree, branches, bird, brothers | Keyword search, every word counts |
| Only the eye | Matching meaning |
| Reflection in the pool | An embedding in a vector index |
| Aim at the image, hit the fish | Find the nearest embedding, return its passage |
| Ripples on the water | Noisy passages, blurry results |

## See It Work

The shopper asks, *"Money back for a broken blender."*

The help centre has three pages. Each already has its reflection. The system makes one for the question. Then it scores how close each page is. A score of 1.0 means the same meaning. These scores are illustrative.

| Help page | Shares words? | Closeness |
|---|---|---|
| Returns and refunds for damaged items | None | 0.89 |
| Money-back guarantee on subscriptions | "money back" | 0.62 |
| Five blender cleaning tips | "blender" | 0.48 |

Keyword search ranks the refund page last. Semantic search puts it first.

## Where the Story Stops

Arjuna shoots one arrow. A search system returns a short list, usually the top few passages.

And meaning is not everything. A product code like *BL-4021* means little to an embedding model. So many real systems run keyword and semantic search together. This is called **hybrid search**.

What happens to the passages next is the story of [RAG](posts/mountain-quest/). How millions of reflections are searched in a blink is the story of [vector databases](posts/ultimate-cosmic-race/).

## Takeaway

Good search does not count your words. It works out what you are aiming at. Then it looks for it in a pool of meanings.

> See only the eye. Aim at the reflection.
