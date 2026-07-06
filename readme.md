HalfLife
A fun, unserious microSaaS calculator that applies radioactive decay math to human lifespan.
The idea
Radioactive atoms don't age. Each atom has a fixed probability of decaying per unit time, regardless of how "old" it is — this is what half-life actually measures. HalfLife asks: what if humans worked the same way? No aging, just a fixed annual chance of "decaying." Pick a long enough half-life and you're functionally immortal — not guaranteed to live forever, but with odds so good that death becomes background noise rather than an inevitability tied to age.
The project turns that thought experiment into a shareable, half-serious calculator: enter your birthdate, pick a themed "isotope," and see your personal decay stats.
Core math
Everything derives from one formula:
N(t) = N₀ · e^(-λt)          λ = ln(2) / half-life
From there:
StatFormulaMeaningSurvival oddse^(-λt)Probability you're still "alive" at time tAnnual death odds1 - e^(-λ)Odds of decaying in any single yearMedian lifespan= half-lifeAge by which 50% have decayedMean lifespan≈ half-life × 1.443Always longer than the median — long survivors pull the average up% decayed(1 - e^(-λt)) × 100How far along your current age puts you
Isotope themes (v1)
Users pick a "half-life" flavor rather than typing in a raw number:

🦈 Greenland Shark — 400 years
🌳 Bristlecone Pine — 5,000 years
☢️ Classic — 10,000 years
⭐ Big Blue Star — 1,000,000 years
☢️ Uranium-238 — 4.5 billion years

Each ties back to something real (actual shark lifespans, actual tree ages, the actual half-life of U-238), which is part of the joke and part of the fun-fact payload.
What's built in the demo deck
The current HTML draft (neobrutalism-styled, bold borders + hard shadows) includes:

Theory section — plain-language explanation of the concept plus the core decay formula.
Formula reference cards — the four key equations laid out visually.
Live calculator — birthdate (calendar picker, dd-mm-yyyy display) + isotope dropdown → computes and displays:

% decayed at current age
Annual odds of "decay," expressed as "1 in X"
A real-world odds comparison (lightning strike, royal flush, vending machine death, etc.) matched to the nearest equivalent
A plain-language explanation paragraph that restates the numbers in context (age, isotope, median vs. mean) so the stats aren't just floating numbers


Dynamic fun fact bank — updates based on the chosen isotope and computed odds, rather than showing static text.
General radioactivity facts — Marie Curie, banana equivalent dose, medical isotopes (Tc-99m), the extreme range of real half-lives, and the true randomness of decay at the atomic level.
Footer — brand mark, tagline, lightweight disclaimer.

This demo is a feedback-gathering draft, not the production build — the goal is to test whether the concept, tone, and comparisons land before committing to a real single-file build.
