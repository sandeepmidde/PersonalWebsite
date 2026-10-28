# Prompt Engineering Explained
Subtitle: Twenty-four times King Vikram answers Betal's riddle and loses his prize. The twenty-fifth time, silence sets him free.
Story: 🌙 Vikram and Betal · King Vikram
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: How clear instructions, with rules that never clash and a safe way to say "I don't know", make an AI reliable.

## Wrong Ticket

You ask a new assistant, "Book me a train ticket to Pune."

They come back proudly. A first-class ticket, for tomorrow at 5 am, with three changes on the way.

They did exactly what you said. You just did not say enough.

An AI is the same. It does its best with the instructions it gets. Vague instructions, vague answers. And instructions that fight each other? Something worse.

An old tale of a king and a spirit shows exactly how that goes wrong.

## Night in the Cremation Ground

Midnight. A cremation ground, lit by a thin moon.

King **Vikram** has made a promise to a sage. Bring me the corpse that hangs from the old tree.

Vikram climbs the tree, cuts the body down and lifts it onto his shoulder. Then the corpse laughs.

It is possessed by **Betal**, a clever spirit.

"It is a long walk, King," says Betal. "I will tell you stories on the way. But first, two rules."

"Speak."

"One. You will walk in silence. Say a single word, and I fly back to my tree."

"And two?"

"At the end of each story, I will ask a riddle. If you know the answer and keep quiet, your head will burst into a thousand pieces."

Vikram nods and begins to walk.

## First Riddle

Betal tells of a woman whose husband and brother both lose their heads. A goddess lets her join the heads back on. In her hurry, she swaps them.

"So tell me, King. Which man is now her husband?"

Vikram thinks. He knows.

"The one with the husband's head," he says. "The head rules the body."

"Correct!" cries Betal. "And you spoke."

With a shriek, he flies back to the tree.

Vikram sighs, turns around, and walks back to fetch him.

## Twenty-Four Nights

It happens again. And again.

Every night, a new tale. Every night, a riddle. Vikram is wise, so every night he knows the answer. He must speak, or his head will burst. And the moment he speaks, Betal is gone.

Twenty-four times, the walk ends at the tree.

![Two rules, one trap](rules-loop.svg "aside")

## Twenty-Fifth Night

Betal tells one last tale. A father and son marry a mother and her daughter. The father marries the daughter. The son marries the mother. Both couples have children.

"How are those children related to each other?"

Vikram thinks. And thinks.

He truly does not know. So he says nothing.

Betal waits. Silence.

Then the spirit laughs, delighted. "At last, King. You have kept both rules."

The walk is finally complete.

## What Betal's Rules Teach

**Vikram** is the AI. Wise, willing, and bound to follow whatever rules he is given.

**Betal's two rules** are the instructions given to the AI before any question arrives. Engineers call these instructions a **prompt**, and the craft of writing them well **prompt engineering**.

**The trap** is in the rules themselves. *Stay silent* and *answer if you know* cannot both be kept by someone who knows. Vikram failed twenty-four times, not because he was foolish, but because the rules fought each other. An AI given clashing rules fails the same way. Told "always give a full answer" and "never say anything you are unsure of", it usually breaks the second rule. That is how a confident guess is born.

**The twenty-fifth night** is the way out. When Vikram truly did not know, silence kept both rules. An AI needs the same door. A rule that says, *if you are not sure, say so.*

Just as your assistant needed the date, the time and the class, not just "Pune".

## Writing Rules That Work

So engineers write instructions the way Betal should have.

They tell the AI who it is and who it is helping.

They tell it what to work from, such as the documents it is given, and nothing else.

They tell it the shape of a good answer. How long, what tone, what to include.

They give it a way out. If the answer is not in front of it, say so, and point to a person who can help.

And they show one or two examples of a perfect answer. Examples teach faster than rules.

![Instructions in four parts](prompt-parts.svg "aside")

## Story to System

| In the story | In an AI system |
|---|---|
| Vikram, wise and willing | The AI |
| Two rules set before the walk | Instructions given before any question, the prompt |
| Rules that cannot both be kept | Clashing instructions that force a guess |
| Silence on the twenty-fifth night | A safe way to say "I don't know" |
| Betal flying back | A bad answer, so the instructions get fixed |

## See It Work

A bank builds a chat assistant. The first instruction is one line.

```text
Help customers with their savings account questions.
```

A customer asks, "Can I close my fixed deposit early?" The assistant invents a penalty that does not exist.

The team rewrites the instructions.

```text
You are the support guide for Acme Bank savings and fixed deposit accounts.
Answer only from the policy pages given with the question.
Keep answers under 80 words, in plain English, and name the policy you used.
If the policy pages do not answer the question, say "I don't have that detail,
here is how to reach an advisor" and stop.
Example question. What is the minimum balance for a savings account?
Example answer. The minimum balance is 1,000 rupees (Savings Account Policy).
```

The same question now gets the real rule from the policy page. And when the page is silent, the assistant says so.

## Where the Story Stops

Vikram needed twenty-four failures. You can learn faster.

Try your instructions on a set of real questions, including some the AI should not answer. Every bad answer is a flight back to the tree. It shows you which rule to fix.

## Takeaway

Your assistant booked the wrong ticket because you said too little.

Say enough, never let your rules clash, and always leave room for "I don't know".

> Clear rules that never clash, and a safe way to say "I don't know".
