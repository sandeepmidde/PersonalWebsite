# Prompt Engineering Explained
Subtitle: Every riddle Betal tells comes with rules, and one wrong move sends the journey back to the start.
Story: 🌙 Vikram and Betal · King Vikram
Tags: AI, Technical
Series: Tarang Tales
Date: 2026-10-28
Summary: How clear roles, rules and examples turn an unpredictable model into a reliable one.

## Journey Through the Forest

In the old Indian tales of **Vikram and Betal**, the brave King **Vikram** must carry the spirit **Betal** down from a tree and across a dark forest, in silence.

Betal is clever and restless. As they walk, he tells a story that ends in a riddle. Then he sets the rules. If Vikram knows the answer and stays silent, his head will burst into pieces. If he speaks, Betal flies back to his tree and the journey begins again.

Again and again, Vikram answers wisely, and again and again, Betal escapes. The tales are remembered for the riddles, but what drives every one of them is the set of rules.

![Rules shape every turn of the journey](rules-loop.svg "aside")

## Clever but Unpredictable

A large language model is a lot like Betal. It is brilliant with words, it can tell any story and it will happily go wherever the conversation leads. Left without direction, that brilliance turns into rambling answers, the wrong tone or a format no one can use.

**Prompt engineering** is the craft of giving the model clear direction before it starts. The most important part is the **system prompt**, the standing instructions that sit above every user message.

## Rules of the Road

Betal's journey works because the rules are explicit and never change. A good system prompt works the same way.

- **A clear role.** Tell the model who it is and who it serves. Vikram knows exactly what he is carrying and why.
- **Firm constraints.** State what must and must not happen, such as length, tone, sources to use and topics to refuse. The rule of silence is never left vague.
- **Consequences for bad answers.** Ask the model to say "I don't know" when it lacks the facts, rather than guess.
- **Examples.** Show two or three sample questions with ideal answers, called **few-shot examples**. Each of Betal's tales follows the same pattern of story, riddle and answer, so the shape is never in doubt.

![A system prompt in four parts](prompt-parts.svg "aside")

## Why Rules Beat Hope

A vague prompt hopes the model guesses what you meant. A structured prompt removes the guessing. The model is still the same clever, unpredictable storyteller, but now it walks a path you have drawn, and the answers come back in the shape you need.

## Takeaway

You cannot make a language model less creative, and you would not want to. You can give that creativity a road to travel on.

> Set the rules before the story begins.
