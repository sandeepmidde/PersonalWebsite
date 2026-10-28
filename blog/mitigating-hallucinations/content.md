# Mitigating AI Hallucinations
Subtitle: A golden deer too perfect to be real, and the one voice that said check before you chase.
Story: 🦌 The Golden Deer · Lakshmana
Tags: AI, Technical, Governance
Series: Tarang Tales
Date: 2026-10-28
Summary: Why fluent AI answers can still be false, and how checks built into the system catch them before anyone acts on them.

## Answer That Looks Perfect

You ask an AI assistant for last year's revenue growth.

*"Revenue grew 42% in 2019, according to the annual report."*

Clean sentence. A number. A source. You paste it into your slides.

The report actually says 24%.

This is a **hallucination**. The model wrote something that sounds true and is not. The danger is not that it looks broken. The danger is that it looks perfect.

## Morning in the Forest

The **Ramayana**. Exile, year thirteen.

**Rama**, **Sita** and **Lakshmana** live in a small hut in the Panchavati forest. One morning, Sita steps outside and gasps.

A deer stands at the edge of the clearing. Its coat shines like gold. Its antlers glitter like jewels. Silver spots dance on its sides.

"Look at it," she whispers. "Rama, please. Bring it to me."

Rama reaches for his bow.

Lakshmana does not move. He is watching the deer closely.

"Brother, wait. I have walked these forests for years. No deer looks like that. Gold does not grow on animals. This could be a trick of the demons."

![A hallucination looks right until it is checked](check.svg "aside")

## What Lakshmana Did

Lakshmana did not argue about how beautiful the deer was. He asked one question.

*Does this match what I know to be real?*

That is exactly what a **guardrail** does in an AI system. It checks an answer against known facts before anyone acts on it.

- **Check against the source.** Compare the answer with the documents it came from. Does the source really say 42%? Tools such as RAGAS score this as **faithfulness**, the share of an answer the sources support.
- **Test with known answers.** Keep a set of questions whose answers you already know. Run them often. If accuracy drops, you see it before users do.
- **Screen for harm.** Models such as Llama Guard check for unsafe content. They guard against harm, not made-up facts. So they sit beside the source check, not in place of it.
- **Ask a person.** For big decisions, a human signs off before the answer becomes an action.

## When the Warning Is Ignored

Rama chases the deer anyway. Deep in the forest, his arrow finds it. As it falls, the deer cries out in Rama's own voice.

"Lakshmana! Sita! Help me!"

The deer was the demon **Maricha** all along.

Back at the hut, Sita panics. "Go! Your brother is in danger!"

"It is a trick," says Lakshmana. "No one can harm Rama."

But Sita insists, and Lakshmana gives in. He leaves.

Moments later, **Ravana** arrives and carries Sita away.

Lakshmana's warning was right. It was simply overruled.

![Every answer passes the check before it acts](guardrail-flow.svg "aside")

## Story to System

| In the story | In an AI system |
|---|---|
| The golden deer | A fluent, confident, false answer |
| Sita's delight | Users trusting what looks polished |
| "No deer looks like that" | Checking the answer against known facts |
| The warning that was overruled | A check that only warns and can be skipped |
| Ravana at the hut | Real harm from acting on a false answer |

## See It Work

Back to the revenue answer. This time a check sits in the path.

1. **The model answers.** *"Revenue grew 42% in 2019."*
2. **The check reads the source.** The annual report says 24%.
3. **The claim fails.** Its faithfulness score is low.
4. **The system acts on it.** It does not show the answer. It says, *"I could not confirm this figure. Here is the passage from the report."*

The slide is never made. The mistake never leaves the building.

## Where the Story Stops

Lakshmana only warned. Sita could overrule him, and she did.

In production, the check cannot be a polite warning. It has to sit in the path of the answer. A failed check stops the next step. No debate.

No check catches everything. But each one lowers the risk, and together they lower it a lot.

## Takeaway

Hallucinations will not go away. Fluent writing is what these models are built for.

What you control is whether a beautiful answer gets checked before it is trusted.

> The more perfect it looks, the more carefully you check it.
