# Fine-Tuning vs RAG
Subtitle: Turned away by Drona, Eklavya shapes a clay teacher and trains until the skill is his own.
Story: 🏹 Eklavya's Clay Teacher · Eklavya
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: When to train knowledge into an AI and when to hand it the right pages each time it answers.

## Two Ways to Pass an Exam

Think back to school exams.

For maths, you practised sums again and again, until the method was in your head. On exam day, you needed no book.

For some other exams, the teacher said, "Open book." You did not memorise the facts. You found them in the book, right when you needed them.

Both work. But they suit different things.

AI can learn in these same two ways. To see when to use which, meet two students of the same teacher.

## Boy at the Gate

Hastinapura. The royal archery school.

The great teacher **Drona** trains the princes. His favourite is **Arjuna**. Arjuna can ask Drona anything, any day. Drona stands beside him and answers in the moment.

One morning, a young hunter appears at the gate. His name is **Eklavya**.

"Guru, please teach me archery."

Drona looks at the boy's rough clothes. "This school is for princes. I cannot teach you."

Eklavya bows and walks back into the forest.

## Clay Teacher

Deep in the woods, Eklavya digs clay from the riverbank. He shapes it into a statue of Drona and sets it in a clearing.

Every day, he stands before it and shoots. The statue cannot speak. It cannot correct him. So he corrects himself. One arrow. Then a thousand more.

Seasons pass. Slowly, the skill moves into his hands.

One day, a dog wanders into his clearing and will not stop barking. Without looking up, Eklavya fires seven arrows. They fill the dog's open mouth and silence it, without drawing a drop of blood.

He did not need to ask anyone how. The skill was his.

![Two ways to learn](two-students.svg "aside")

## Statue That Never Changes

Now imagine this. Back at the palace, Drona invents a new way to shoot. He shows it to Arjuna that afternoon.

Arjuna learns it by evening.

And Eklavya, far away in the forest? His clay teacher stands silent, just as it was on the day he shaped it.

He will never learn the new move.

## What the Two Students Show

**Eklavya practised until the skill was his.** That is like learning maths for a closed-book exam. In AI, this is called **fine-tuning**. The AI is trained again and again on examples until the new skill becomes part of it. After that, it needs no notes.

**Arjuna asked his teacher, right when he needed to.** That is the open-book exam. In AI, this is called **RAG**. Each time a question comes, the system finds the right pages and puts them in front of the AI. The AI answers from them, and keeps nothing afterwards.

**The statue never changes.** This is the key difference. What a fine-tuned AI learns is frozen on the day of training. When the facts change, it does not know. An AI using RAG reads today's pages, so its answers stay current.

Just as you never needed a book for sums, but always checked the book for facts.

## Choosing the Right Way

So engineers ask one question about each thing the AI must know. Will it change?

Skills that stay the same, like a way of writing, a tone of voice or a fixed format, are worth training in. Like Eklavya's aim.

Facts that keep changing, like prices, rules or today's numbers, are better looked up each time. Like Arjuna asking Drona.

Many good systems use both. Trained for the skill, handed the facts.

## Story to System

| In the story | In AI |
|---|---|
| Eklavya practising for years | Fine-tuning, training on many examples |
| The skill in his hands | Knowledge built into the AI |
| Arjuna asking Drona each day | RAG, fetching pages at question time |
| The silent clay statue | Training that is frozen in time |
| A new move Eklavya never learns | Facts that changed after training |

## See It Work

A bank builds a customer assistant. It needs two kinds of knowledge.

1. **How to speak.** Calm, clear, always naming the next step. This rarely changes. The team **trains it in**, using a few thousand of their best past replies.
2. **What is true today.** Interest rates, fees, branch timings. These change every month. The team **keeps them in documents** the assistant reads each time.
3. **A customer asks.** *"What is the fixed deposit rate today?"*
4. **Both work together.** The trained-in style shapes the reply. Today's rate sheet supplies the number.

## Where the Story Stops

Eklavya and Arjuna were rivals. In AI, the two methods work best as partners.

A common mistake is to train facts into the AI. They go stale like the clay statue. And every update means training all over again.

## Takeaway

You practised sums until you knew them. You looked up facts in the book.

Train the AI in what stays the same. Let it look up what changes.

> Train the skills that never change. Look up the facts that always do.
