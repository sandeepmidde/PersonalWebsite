# Fine-Tuning vs RAG
Subtitle: Turned away by Drona, Eklavya shapes a clay teacher and trains until the skill is his own.
Story: 🏹 Eklavya's Clay Teacher · Eklavya
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: When to train knowledge into a model and when to hand it the right pages at the moment it answers.

## Two Ways to Learn

You want an AI model to know something new. Your company's tone. Your product range. Today's prices.

There are two ways to teach it.

- **Fine-tuning.** Train the model further on your examples, until the new skill is part of it.
- **RAG.** Leave the model as it is. Hand it the right pages each time it answers.

Which one when? Two students of the same teacher show the difference.

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

He did not need to ask anyone how. The skill was simply his.

![Two ways to learn the same skill](two-students.svg "aside")

## Two Students, Two Methods

**Eklavya is fine-tuning.** He practised on thousands of examples until the skill lived inside him. A fine-tuned model works the same way. Training changes its **weights**, the numbers that shape how it responds. Afterwards, it needs no notes.

**Arjuna is RAG.** He had a teacher at his side who answered each question as it came. A RAG system places the right documents in front of the model every time it answers. The model reads them, replies and keeps nothing.

## Statue That Never Changes

Now picture this. Drona invents a new technique and teaches it to Arjuna.

Arjuna learns it that afternoon.

Eklavya never hears of it. His clay teacher is frozen on the day he made it.

This is the real dividing line.

- **Fine-tuning is frozen.** The model knows what it was trained on, up to the day of training. When the facts change, you must train it again.
- **RAG stays current.** Update the documents, and the very next answer uses them. The model can also point to its source.

## Story to System

| In the story | In AI |
|---|---|
| Eklavya practising for years | Fine-tuning on many examples |
| Skill that lives in his hands | Knowledge stored in the model's weights |
| Seven arrows, no one to ask | A fine-tuned model working without notes |
| Arjuna asking Drona each day | RAG fetching documents at question time |
| A technique Eklavya never learns | Facts that change after training |

## See It Work

A bank builds a customer assistant. It needs two kinds of knowledge.

- **How to speak.** Calm, clear, always naming the next step, never giving investment advice. This rarely changes. **Fine-tune it.** Train on a few thousand ideal past replies.
- **What is true today.** Interest rates, fees, branch timings. These change every month. **Retrieve them.** Keep them in documents the assistant reads at answer time.

A customer asks, *"What is the fixed deposit rate today?"*

The fine-tuned style shapes the reply. The retrieved rate sheet supplies the number.

## Where the Story Stops

Eklavya and Arjuna were rivals. In AI, the two methods work best together.

A common mistake is to fine-tune a model on facts. The facts go stale. The model cannot show where they came from. And every update means training again.

## Takeaway

Practice builds what stays. A teacher at your side brings what is new.

Good AI systems decide, piece by piece, which kind of learning each piece of knowledge needs.

> Train the skills that never change. Retrieve the facts that always do.
