# Proposal Site Design

## Summary

This project is a single-page proposal website presented as an auto-playing pixel fairytale film. The experience uses two custom 8-bit characters based on the couple, then leads the viewer through a short rescue story, a shared-photo memory sequence, and a final interactive proposal reveal.

The site is designed primarily for one viewer on a laptop or desktop in landscape orientation. The total experience should run about 60-90 seconds before pausing on a treasure chest prompt that the viewer clicks to trigger the final proposal moment.

## Goals

- Deliver a romantic, dreamlike proposal experience with a recognizable 8-bit game identity.
- Preserve recognizability of both people through pixel-character silhouettes and colors.
- Keep the experience emotionally smooth and stable by using a scripted animation timeline rather than real gameplay.
- Integrate 6-12 shared photos as a memory montage after the rescue sequence.
- End on a still, screenshot-friendly proposal tableau with a single Chinese proposal line.

## Non-Goals

- Building a fully interactive platform game.
- Creating combat systems, collision logic, or player-controlled movement.
- Recreating a strict Mario clone or a parody-first game.
- Using dense UI, menus, or branching choices.

## Audience And Constraints

- Primary audience: the female partner alone.
- Primary device: laptop or desktop in landscape layout.
- Preferred tone: dreamlike fairytale with game-inspired structure.
- Language: Chinese.
- Text usage: minimal, only at key story beats.
- Audio: background music is part of the intended experience.
- Final interaction: the story pauses before the ending and waits for the viewer to click the chest or heart.

## Narrative Concept

The experience presents the couple as 8-bit characters inside a pixel fairytale world. The woman accidentally enters a dragon's cave and is trapped inside a magical trial. The man enters the cave, defeats the dragon in a scripted rescue sequence, and reunites with her. The world then shifts from danger to memory, showing real photos from the relationship as if they are treasures unlocked by the rescue. After the memories finish, the couple returns to the cave treasure chest. The viewer clicks the glowing chest or heart prompt, which opens into the final proposal scene with a heart, a ring, and the kneeling proposal.

## Character Direction

### Female Lead

- 8-bit character style inspired by classic Mario-era sprites.
- Key identifiers: long hair, purple coat, gentle posture.
- Opening action can include a light raised-hand or peace-sign-inspired gesture if it reads cleanly in pixel form.

### Male Lead

- 8-bit character style inspired by classic Mario-era sprites.
- Key identifiers: glasses, dark outerwear, optional simplified backpack or camera hint.
- Body language should feel determined during the rescue and tender during the final kneeling moment.

### Villain And Props

- The dragon should read as fairytale-dangerous, not horror-focused.
- The treasure chest should feel magical and important from its first appearance.
- The heart and ring are reserved for the final emotional payoff and should become the brightest elements on screen during the proposal.

## Experience Timeline

The timing below should remain flexible by a few seconds during implementation, but the full experience should stay within the 60-90 second target.

### 1. Opening Setup

- Duration: about 6-8 seconds.
- Scene: pixel night sky, mountains, forest, and a softly glowing cave entrance.
- Subtitle: one short Chinese fairytale-style opening line.
- Action: the female lead wanders into the cave out of curiosity.

### 2. Dragon Trial

- Duration: about 8-12 seconds.
- Scene: cave interior with warm firelight, treasure hints, and the dragon.
- Subtitle: one short line explaining that she entered the dragon's secret domain.
- Action: the dragon traps her on a high platform or within a magical glowing barrier.

### 3. Rescue Sequence

- Duration: about 12-18 seconds.
- Scene: the male lead enters from the opposite side and moves through a few stylized platforming beats.
- Action: run, jump, dodge, brief confrontation, flash of victory, dragon defeated, chest unlocked, reunion.
- Important rule: this must feel like a cinematic rescue sequence rather than a playable battle.

### 4. Memory Montage

- Duration: about 18-25 seconds.
- Scene transition: chest glow, floating heart-light, or another magical bridge from the cave into memory space.
- Action: 6-12 real couple photos appear one after another with soft motion and layered transitions.
- Subtitle: one Chinese line about shared time being the real treasure.

### 5. Chest Pause

- Duration: about 6-10 seconds or until clicked.
- Scene: return to the pixel world with the reunited couple standing before the chest.
- Action: the chest glows gently and the whole scene becomes calm and expectant.
- Prompt: a very light Chinese hint inviting the viewer to click and open the ending.

### 6. Proposal Reveal

- Trigger: user click on the chest or heart prompt.
- Action: chest opens, heart pops out first, ring appears, male lead kneels.
- Final line: a single Chinese proposal sentence such as "你愿意嫁给我吗？"
- End state: the scene remains on the proposal tableau and does not auto-restart.

## Visual Direction

The visual language should combine 8-bit characters with softer fairytale staging.

### Style Blend

- Characters: crisp, classic 8-bit silhouettes.
- Environments: more atmospheric and luminous than strict retro game backgrounds.
- Motion: cinematic transitions instead of flashy webpage effects.

### Color Strategy

- Opening and cave: deep blue, forest green, muted violet, ember gold.
- Memory section: soft cyan, warm white, blush pink, pale gold.
- Proposal scene: warm white, champagne gold, light pink, star-glow highlights.

### Mood

- Adventure first, but never comedic or noisy.
- Romantic softness should increase after the rescue.
- The proposal scene should feel still, sacred, and screenshot-friendly.

## Typography And Copy

- All text should be in Chinese.
- Use only a few short subtitle moments rather than dense narration.
- Typography should feel warm and readable, with a slight pixel-game influence if it does not hurt romance or legibility.
- The final proposal line should be the clearest and most prominent text element in the entire experience.

## Interaction Design

The site should contain one meaningful user interaction.

- Everything before the final treasure moment auto-plays.
- The chest pause should clearly communicate that the viewer needs to click to continue.
- Hover or focus on the chest can add a small glow response, but the UI should stay subtle.
- The final proposal should not include confirmation buttons or branching responses.

## Information Architecture

This should be built as one continuous page with internal scene states rather than multiple route changes.

### Scene States

- Preload intro
- Opening setup
- Dragon trial
- Rescue sequence
- Memory montage
- Chest pause
- Proposal reveal
- Final resting state

### User Flow

1. Open site.
2. Experience starts and assets preload.
3. Auto-played story runs through rescue and memories.
4. Viewer clicks chest or heart.
5. Proposal reveal remains on screen.

## Asset Plan

The project should separate authored assets from scene logic from the start.

### Recommended Structure

```text
photos/
sprites/
audio/
config/
docs/superpowers/specs/
```

### Asset Notes

- `photos/`: 6-12 relationship photos, named in the intended playback order.
- `sprites/`: male lead, female lead, dragon, chest, heart, ring, flame, terrain, decorative particles.
- `audio/`: one main background track and optional light sound effects for chest reveal and magical beats.
- `config/`: scene timing, subtitle copy, photo order, and transition settings so the experience is not hardcoded into one large script.

## Technical Design

### Core Approach

Build the site as a single-page animated experience with a scripted timeline and one final click trigger.

### Why This Approach

- It keeps the pacing reliable for a proposal setting.
- It reduces implementation risk compared with a true game engine approach.
- It makes it easier to sync visuals, subtitles, photos, and music.
- It allows photo order, copy, and timing to be adjusted without rewriting all animation logic.

### Animation Boundaries

These should be real animated sequences:

- Parallax background movement.
- Character running, jumping, rescuing, kneeling.
- Dragon reaction and defeat.
- Chest glow and opening.
- Heart and ring reveal.
- Photo montage transitions.

These should be staged rather than simulated systems:

- Combat logic.
- Collision systems.
- Playable controls.
- Full platformer physics.
- Complex particle simulation.

## Data Flow And State Model

The experience should behave like a finite scene timeline.

### Inputs

- Pixel sprite assets.
- Real photo files.
- Audio files.
- Scene configuration data for timing and copy.

### Runtime Flow

1. Load configuration and required assets.
2. Enter preload state.
3. Start music and main animation timeline.
4. Advance through scripted scenes by time.
5. Pause in the chest state and wait for click.
6. Trigger proposal sequence.
7. Hold final state until the viewer leaves or refreshes.

### State Concerns

- Only one scene should own the stage at a time.
- The photo montage should be driven by ordered configuration, not hardcoded DOM duplication.
- Audio timing and subtitle timing should both derive from scene definitions wherever practical.

## Audio Design

- Use one cohesive background track that can support adventure, warmth, and the final emotional lift.
- Keep sound effects light and selective.
- Consider a very short title or tap-to-begin moment if needed to reliably unlock browser audio playback.
- The final proposal beat should feel musically lifted but not overwhelmingly loud.

## Error Handling And Resilience

The site should fail gently rather than breaking the mood.

- If a photo fails to load, skip to the next photo instead of freezing the sequence.
- If optional sound effects fail, continue with background music only.
- If autoplay audio is blocked, present a graceful start overlay that invites the viewer to begin the story.
- If viewport size is too small, show a gentle recommendation to switch to a wider screen.
- If assets are still loading, keep the viewer in a polished preload scene rather than exposing unfinished content.

## Performance And Quality Constraints

- Favor lightweight sprite sheets and optimized image sizes.
- Preload critical hero assets before the story starts.
- Avoid overly complex rendering systems that could stutter on a typical laptop.
- Keep animation density lower during emotional beats so the scene remains legible.
- Preserve stable frame pacing over effect quantity.

## Testing Strategy

### Narrative Testing

- Confirm the story reads clearly without verbal explanation.
- Confirm the rescue-to-memory transition feels natural.
- Confirm the final chest pause is understandable and not confusing.

### Content Testing

- Verify that both pixel characters remain recognizable as the couple.
- Verify the female sprite reads as wearing a purple coat.
- Verify each chosen photo appears in the correct order and crops well.
- Verify all Chinese text is legible and emotionally appropriate.

### Interaction Testing

- Verify the full sequence auto-plays correctly.
- Verify the chest click reliably triggers the proposal reveal.
- Verify the final scene stays on screen and does not auto-reset.

### Device Testing

- Test on the intended laptop or desktop device in landscape mode.
- Test a fallback behavior on narrower screens.
- Test with audio autoplay allowed and blocked.

## Success Criteria

The project succeeds if:

- The viewer can understand the story without instructions.
- The 8-bit couple clearly reads as the real couple.
- The photo montage feels emotional rather than slideshow-like.
- The final click interaction feels intentional and magical.
- The proposal reveal lands as the emotional high point of the experience.

## Implementation Guidance For The Next Phase

- Start from scene structure and timing before polishing visuals.
- Treat character readability and emotional pacing as higher priority than mechanical game complexity.
- Keep the site to one page and one meaningful interaction.
- Build configuration-driven photo and subtitle sequencing early so content can be adjusted safely.

## Current Workspace Note

This spec is written into the current workspace, which is not a Git repository at the moment. The design can be reviewed here, but it cannot be committed until the project is moved into or initialized as a Git repository.
