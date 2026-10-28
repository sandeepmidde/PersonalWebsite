# Distributed Computing for AI
Subtitle: Asked to weigh an elephant with a small scale, a clever courtier weighs a boatload of stones instead.
Story: 🐘 Weighing the Elephant · Tenali Raman
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: How AI systems split work too heavy for one machine across many, and add the pieces back together.

## Impossible Scale

A popular folk tale, told in India of the witty courtier **Tenali Raman** and in China of the boy **Cao Chong**, begins with a challenge. Weigh a great war elephant. The only scale on hand is small enough to hold in two hands.

No one can lift an elephant onto a scale, and no scale of that size could bear it.

The clever one walks the elephant onto a large boat moored in the river. The boat sinks lower in the water, and he marks the waterline on its side. Then he leads the elephant off and loads the boat with stones until it sinks to exactly the same mark. Each stone is small enough for the little scale. Weigh them all, add the numbers, and you have the weight of the elephant.

![One huge load becomes many small ones](split-load.svg "aside")

## Too Heavy for One Machine

Modern AI has elephants of its own. Training a large model means trillions of calculations. Serving it means answering thousands of requests at the same moment. A single server, or a single graphics processor (GPU), cannot carry that load alone. It runs out of memory, slows to a crawl or fails.

The answer is the same as the boat. Do not try to lift the elephant. Turn it into stones.

## Stones on Many Scales

- **Split the work.** A big job is broken into many small, similar pieces. Training data is divided into batches, and a model too large for one GPU is divided into parts that each fit.
- **Weigh in parallel.** The pieces go to many machines at once, like many small scales working side by side. This is the idea behind **sharding** and **MapReduce**.
- **Add it back up.** The results are combined into one answer, just as the stone weights add up to the elephant.
- **Balance the load.** A **load balancer** sends each incoming request to whichever machine has room, so no single scale is overloaded while others sit idle.

![Split, process in parallel, combine](parallel-flow.svg "aside")

## Where the Story Stops

The boat trick works because stones add up perfectly. Real computing work is messier. Pieces often need to talk to each other, and that communication costs time. Good distributed systems are designed to keep the pieces as independent as possible, so the boat stays steady while the stones are counted.

## Takeaway

Scale in AI is rarely about one bigger machine. It is about finding the waterline, the right way to turn one impossible load into many ordinary ones.

> When the load is too heavy to lift, change its shape.
