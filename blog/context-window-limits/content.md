# Optimizing Context Windows
Subtitle: A storm too big for any village, and a hill lifted overhead so everyone gets a dry place to stand.
Story: ⛰️ Lifting Govardhan · Krishna
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: Why an AI cannot read everything at once, and how it is fed just the right part, told through Krishna and the great storm.

## One Small Question

Someone asks you a simple question.

*"Who built the bridge to Lanka?"*

The whole **Ramayana** sits open on the table in front of you. All seven books.

Would you start reading from the very first page, out loud, and keep going until you reach the bridge?

Of course not. By the time you got there, you would be exhausted. You might even forget what you were asked.

You would turn straight to the right chapter, read a few lines and answer. *Nala and the vanara army built it.*

An AI faces this same problem every day. It can only keep a small amount of text in mind at one time. Pour a whole library over it at once, and it either refuses, cuts the text off, or loses track of the details in the middle.

So how do engineers stop an AI from drowning in words? The answer is in a story about a storm.

## Boy Who Questioned the Sky

Long ago, in the green village of **Vrindavan**, the cowherds prepared a grand feast every year for **Indra**, king of the gods and lord of thunder and rain.

That year, a young boy watched the preparations and frowned. His name was **Krishna**.

"Father," he asked, "why do we feast for a god far away in the clouds? Look at **Govardhan**. That hill feeds our cows. Its streams fill our pots. Let us honour the hill that cares for us."

The elders looked at one another. The boy made sense.

So the feast went to Govardhan.

## Indra's Rage

Far above, on his throne in the sky, Indra saw the empty altar.

His face darkened.

"A cowherd boy tells them to forget me? Then let them remember me. Send the clouds. All of them."

The sky over Vrindavan turned black at noon.

Thunder split the air. Lightning cracked the trees. And then the rain came. Not a shower. A wall of water, falling without end.

Huts collapsed. Lanes became rivers. Calves bawled in the rising flood. Mothers held their children above the water.

"Krishna!" the villagers cried. "Save us!"

## Hill in the Sky

Krishna walked calmly through the storm to the foot of Govardhan.

He bent down. He slid one small hand under the hill.

And he lifted.

The earth groaned. Rocks tumbled. The whole hill rose off the ground, higher and higher, until it rested on the tip of his little finger, like a giant umbrella.

"Come!" he called. "Everyone! Bring the children. Bring the cows. There is room for all of you."

The villagers ran beneath it. The rain hammered on the hill above them. Water poured off its slopes in streams around the edges.

But underneath, the ground was dry.

For seven days and seven nights, they lived under the hill. No one fought the storm. Each family simply looked after the small, dry space around them, one day at a time.

On the eighth morning, Indra gave up. The clouds parted. The sun came out.

![Everything at once, or a shield overhead](storm-shield.svg "aside")

## What Krishna Really Did

Here is the secret of the story.

Krishna never stopped the rain. He did not make the village bigger. He did one thing. He decided **where the water would land**.

Now think of the AI again.

The storm is all the information in the world. Every report, every email, every page. Far too much for any AI to take in at once.

The small dry space under the hill is how much the AI can keep in mind at one time. Engineers call this the **context window**. It is like a desk. Big or small, it has edges.

The hill is a separate **store** that holds everything. It takes the weight of the storm, so the AI never has to.

And the streams running off the slopes? That is what actually reaches the AI. A small, steady flow. Only the part that is needed, a little at a time.

## Living Under the Hill

So engineers build AI systems the way Krishna sheltered Vrindavan.

Everything is kept in the store, cut into small pieces, like pages of a book.

When a question comes in, the system fetches only the few pieces that matter. Just as you turned straight to the chapter about the bridge. This step is the heart of [RAG](posts/mountain-quest/).

For a really big job, the AI works one piece at a time, like the villagers living one day at a time. It reads a piece, writes a short note about it, then moves to the next. The notes travel forward, so it never loses the thread.

![One page at a time, with notes carried forward](paging-flow.svg "aside")

## Story to System

| In the story | In an AI system |
|---|---|
| Seven days of endless rain | More information than the AI can take in at once |
| Dry space under the hill | How much the AI can keep in mind, its context window |
| The hill taking the storm | A store that holds everything |
| Streams running off the slopes | Only the needed pieces, fed in a little at a time |
| One day at a time | Working piece by piece, with notes carried forward |

## See It Work

A bank wants to know what its customers complained about most in the last ten years.

There are thousands of complaint letters. Far too many for the AI to read in one go.

1. **Split.** The letters are grouped by month. Ten years makes 120 small bundles.
2. **Read one bundle at a time.** For each month, the AI writes a short note. *"Most complaints this month were about card fees."*
3. **Gather the notes.** The 120 short notes are small enough to read together.
4. **Answer.** The AI reads all the notes and writes the ten-year picture.

The AI never had to swallow the flood. It drank one cup at a time.

## Where the Story Stops

Krishna's shelter was perfect. This method is not.

When the AI reads one month at a time, it can miss a link between something in the third month and something years later. Good notes and smart searching make that rare. But the question engineers ask is always the same.

*What does the AI need to see right now?*

## Takeaway

You did not need the whole Ramayana to answer one question. You needed the right page.

AI is the same. The answer is not a bigger desk. It is a store that holds everything, and a steady stream that brings the AI just what it needs.

> You cannot stop the storm. You can decide where it lands.
