# Rescue Finisher Animation Design

## Summary

This design upgrades the `rescue` scene so the male lead's dragon-defeating moment reads as a clear heroic finisher rather than a generic collision-and-fade animation.

The new motion language is:

1. forward pressure
2. leap and brief hang-time
3. holy downward strike
4. decisive impact
5. dragon defeat and heroine release

The scene should still fit the existing proposal-site tone: dramatic and triumphant, but not violent or grotesque.

## Goals

- Make the dragon defeat easy to understand at a glance.
- Preserve the current pixel-fairytale style.
- Keep the sequence readable inside the existing autoplay timeline.
- Use the existing sprite set and primarily improve choreography through CSS and layered effects.
- Create a clean emotional bridge from danger into the calm `chest` scene.

## Non-Goals

- Rebuilding the whole site into a game engine.
- Adding full combat mechanics or input handling.
- Introducing gore, horror framing, or realistic weapon violence.
- Replacing the entire stage system or rewriting all scene animations.

## Current Problem

The existing `rescue` scene already has stronger atmosphere than the first implementation, but the hero action still reads as broad motion rather than a specific finishing move. The dragon's defeat is implied, not clearly staged.

As a result:

- the heroic payoff is weaker than it should be
- the "slay the dragon" story beat is not visually explicit enough
- the transition into the memory and proposal sections loses some narrative force

## Desired Viewer Read

When the `rescue` scene plays, the viewer should understand the following sequence without explanation:

1. the hero has closed the distance
2. he commits to one final attack
3. the attack lands with holy force
4. the dragon is defeated
5. the heroine is safe

If the viewer only glances at the scene for a second, the finisher should still read as "jump -> strike -> win."

## Choreography

### Beat 1: Forward Pressure

The hero advances decisively across the arena platform. This should feel more like a controlled charge than a flat lateral slide.

Visual cues:

- forward-leaning trajectory
- slight ground-skimming momentum
- ember and lava context still active

### Beat 2: Leap And Hang-Time

At attack distance, the hero rises sharply upward into a finishing arc. Near the top, the motion briefly suspends for a fraction of a second so the viewer feels anticipation before the strike.

Visual cues:

- a taller vertical arc than the current motion
- a short pause at the apex
- faint golden pre-impact glow around the hero

### Beat 3: Holy Downward Strike

The hero cuts diagonally downward with a bright holy slash effect. The slash should be visually brighter than the hero sprite so the attack reads even at small size.

Visual cues:

- a diagonal gold-white streak
- a brief flash on contact
- a small radial impact bloom at the strike point

### Beat 4: Dragon Defeat

On impact, the dragon should recoil clearly and then fade or fragment into heat haze and shadow. The motion should feel conclusive, not like a temporary stagger.

Visual cues:

- strong backward displacement
- reduced opacity
- lowered saturation or brightness as it disappears

### Beat 5: Heroine Release

The heroine should not just drift downward generically. Her movement should read as a consequence of the dragon's defeat and the cage losing power.

Visual cues:

- cage or prison aura visibly breaks
- heroine lowers into a safe position
- warm light replaces hostile red lighting

## Visual Language

### Finisher Effect

The finisher should look holy and heroic rather than fiery or brutal.

Preferred palette:

- warm gold
- pale cream
- soft white core

Avoid:

- blood-like reds
- heavy weapon sprites
- over-busy anime-style effects

### Screen Response

The attack should affect the whole stage in a restrained way:

- short flash
- brief reduction in hostile fire emphasis
- subtle shockwave or bloom

The effect should feel cinematic, not noisy.

## Implementation Direction

This should be implemented with the current DOM/CSS stage system rather than introducing a new renderer.

The main changes should be:

- extend `rescue` scene effect layers in the stage renderer
- revise `rescue` hero keyframes for a three-phase finisher path
- add a dedicated holy slash effect layer
- improve dragon recoil/disappearance timing
- refine heroine release timing so it follows the finishing hit

## Testing And Review

This work should be considered successful when:

- the finisher reads clearly in the running site
- the `rescue` scene remains smooth on desktop
- unit tests still pass
- build remains green
- the `chest` scene still feels like a calm resolution after the strike
