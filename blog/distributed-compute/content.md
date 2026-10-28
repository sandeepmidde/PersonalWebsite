# Distributed Computing for AI
Subtitle: Asked to weigh an elephant with a small scale, a clever courtier weighs a boatload of stones instead.
Story: 🐘 Weighing the Elephant · Tenali Raman
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: How AI systems split work too heavy for one machine across many, and add the pieces back together.

## Too Big for One Machine

A large AI model can need around 140 gigabytes of memory just to load. One of today's top graphics processors (GPUs) holds 80.

The model does not fit. No single machine can carry it.

So how does it run at all? A folk tale has the answer. It is told in India of the witty courtier **Tenali Raman**, and in China of the boy **Cao Chong**.

## King's Challenge

The royal court is buzzing. A foreign envoy has brought the king a gift. A giant war elephant.

"Magnificent," says the king. "But how much does it weigh?"

Silence.

The royal scale is brought out. It is small enough to carry in two hands.

"Weigh the elephant on this," says the king, "by sunset."

The ministers look at each other. One whispers, "We would need a scale the size of a palace."

Tenali Raman smiles. "Give me a boat, Your Majesty. And a lot of stones."

## Down by the River

At the river, Tenali leads the elephant onto a large boat. The boat sinks low in the water.

He takes a piece of chalk and draws a line on the hull, exactly where the water touches it.

Then he leads the elephant off. The boat rises.

"Now," he tells the servants. "Load stones. Stop when the water reaches my mark."

Basket after basket, they fill the boat. It sinks lower. Lower. The water touches the line.

"Stop."

Each stone is small enough for the little scale. Ten servants weigh ten stones at a time, side by side. They add up every number.

Tenali bows. "Your Majesty. Your elephant weighs exactly this much."

![One huge load becomes many small ones](split-load.svg "aside")

## What Tenali Did

He never tried to lift the elephant. He did three things.

1. **He found an equal.** The waterline proved that the pile of stones weighed the same as the elephant.
2. **He split it into pieces that fit.** Every stone fit the small scale.
3. **He added it back up.** Many small results became one big answer.

And because no stone depended on any other, many servants could weigh at once.

Distributed computing works the same way.

- **Split the work.** A model too big for one GPU is cut into parts, and each part sits on a different GPU. A mountain of training data is cut into batches.
- **Work side by side.** Many GPUs process their pieces at the same time. This is called **parallel** processing.
- **Combine the results.** The pieces are joined into one answer, just as the stone weights add up to the elephant.
- **Share the load.** A **load balancer** sends each new request to whichever machine has room. No servant stands idle while another is buried in stones.

![Split, process in parallel, combine](parallel-flow.svg "aside")

## Story to System

| In the story | In distributed computing |
|---|---|
| The elephant | A model or job too big for one machine |
| The small scale | One GPU, with limited memory |
| Stones that match the waterline | Pieces that together equal the whole job |
| Servants weighing side by side | GPUs working in parallel |
| Adding the weights | Combining the results |

## See It Work

**Running a big model.** It needs about 140 GB. Each GPU holds 80 GB. So the model is split across several GPUs, often four or eight, to leave room for working memory. Each GPU holds its share and passes its result to the next.

**Training on a mountain of data.** A team has a billion examples. They give each of 8 GPUs one eighth of the data. All 8 learn at the same time. After each round, they share and average what they learned. The job finishes close to 8 times faster than on one GPU.

## Where the Story Stops

Stones add up perfectly. Real computing is messier.

GPUs often need to talk to each other while they work, and talking takes time. Good distributed systems keep the pieces as independent as possible. The fewer messages, the closer you get to Tenali's perfect sum.

## Takeaway

Scale in AI is rarely about one bigger machine. It is about finding the waterline. The way to turn one impossible load into many ordinary ones.

> When the load is too heavy to lift, change its shape.
