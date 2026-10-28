# Mitigating AI Hallucinations
Subtitle: A golden deer too perfect to be real, and the one voice that said check before you chase.
Story: 🦌 The Golden Deer · Lakshmana
Tags: AI, Technical, Governance
Series: Tarang Tales
Date: 2026-10-28
Summary: Why an AI's polished answer can still be false, and how checks catch it before anyone acts on it.

## Too-Good Answer

Your manager needs last year's growth figure for a meeting in ten minutes. You ask an AI assistant.

*"Revenue grew 42% last year, according to the annual report."*

A clean sentence. A number. A source. You paste it into the slides.

In the meeting, someone opens the report. It says 24%.

The answer looked perfect. That was the problem.

To understand why this happens, and how to stop it, we go to a forest in the **Ramayana**.

## Morning in the Forest

Exile, year thirteen.

**Rama**, **Sita** and **Lakshmana** live in a small hut in the Panchavati forest. One morning, Sita steps outside and gasps.

A deer stands at the edge of the clearing. Its coat shines like gold. Its antlers glitter like jewels. Silver spots dance on its sides.

"Look at it," she whispers. "Rama, please. Bring it to me."

Rama reaches for his bow.

Lakshmana does not move. He is watching the deer closely.

"Brother, wait. I have walked these forests for years. No deer looks like that. Gold does not grow on animals. This could be a trick of the demons."

![Looks right, check first](check.svg "aside")

## Voice in the Forest

Rama chases the deer anyway. Deep in the forest, his arrow finds it. As it falls, the deer cries out in Rama's own voice.

"Lakshmana! Sita! Help me!"

The deer was the demon **Maricha** all along.

Back at the hut, Sita turns pale. "Go! Your brother is in danger!"

"It is a trick," says Lakshmana. "No one can harm Rama."

"Go!"

Lakshmana gives in. He leaves.

Moments later, **Ravana** arrives and carries Sita away.

Lakshmana was right. But his warning was overruled.

## What Lakshmana Saw

**The golden deer** is an AI answer that looks perfect and is false. Smooth words, a confident tone, even a source. Engineers call this a **hallucination**. The AI is not lying on purpose. It is built to write what sounds right, and sometimes what sounds right is wrong.

**Sita's delight** is how people react to a polished answer. It looks so good that nobody questions it.

**Lakshmana's question** was simple. *Does this match what I know is real?* In an AI system, a **check** asks the same thing before the answer is used. Does the source really say 42%?

**The overruled warning** is a check that only warns. If someone can wave it aside in a hurry, it will be waved aside.

Just as you would have been saved by opening the report before pasting the number.

## Building Lakshmana In

So engineers place checks between the AI and the people who use its answers.

The first check compares the answer with the documents it came from. If the source says 24%, an answer of 42% fails.

The second keeps a set of practice questions with known answers. The AI is tested on them often. If it starts getting more wrong, the team sees it early.

For big decisions, the last check is a person. Someone signs off before the answer turns into an action.

And the checks are placed *in the path*. A failed check does not just warn. It stops the answer.

![The check sits in the path](guardrail-flow.svg "aside")

## Story to System

| In the story | In an AI system |
|---|---|
| The golden deer | A polished, confident, false answer |
| Sita's delight | Trusting what looks perfect |
| "No deer looks like that" | Checking the answer against the source |
| The overruled warning | A check that can be skipped |
| Ravana at the hut | Real harm from acting on a false answer |

## See It Work

Back to the growth figure. This time a check sits in the path.

1. **The AI answers.** *"Revenue grew 42% last year."*
2. **The check reads the report.** The report says 24%.
3. **The check fails.** The answer does not match its source.
4. **The answer is stopped.** Instead, you see, *"I could not confirm this figure. Here is the passage from the report."*

The wrong number never reaches the slides.

## Where the Story Stops

Lakshmana could only warn. A real system can do more, and stop the answer itself.

Still, no check catches every mistake. Each one makes mistakes rarer, and together they make them much rarer.

## Takeaway

The 42% looked perfect. One look at the report would have caught it.

Never let a polished answer skip the check.

> The more perfect it looks, the more carefully you check it.
