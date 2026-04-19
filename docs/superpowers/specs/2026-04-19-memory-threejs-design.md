# Memory Three.js Scene Design

## Summary

This design upgrades the `memory` scene from a static photo grid into a Three.js-driven memory-space sequence. The new scene should feel like entering a quiet galaxy of shared memories: one hero photo arrives first, then the rest of the photos expand into a soft 3D starfield around it, and finally the whole memory field gathers back toward the center before returning to the treasure chest.

The viewer should still be looking at the photos first. Three.js exists here to provide depth, atmosphere, and cinematic transition, not to overpower the relationship photos.

## Goals

- Replace the current flat memory display with a more emotional and immersive sequence.
- Keep the photos as the main subject of the scene.
- Use Three.js only for the `memory` scene so the rest of the site architecture stays stable.
- Create a clear transition from post-rescue triumph into shared memories, then from memories back to the chest scene.
- Keep the camera movement calm and readable.

## Non-Goals

- Converting the entire site to Three.js.
- Building a free camera or user-controlled 3D gallery.
- Using dense particle counts or flashy effects that compete with the photos.
- Turning the memory scene into a slideshow with random 3D motion and no narrative pacing.

## Current Problem

The current `memory` scene presents the photos in a simple DOM layout. It works functionally, but it reads as a gallery wall more than a magical release of shared memories.

The current version lacks:

- true depth
- transition hierarchy
- atmosphere strong enough to justify the emotional handoff from rescue to proposal

## Experience Goal

When the `memory` scene begins, the viewer should feel that the rescued world opens into a shared emotional universe.

The ideal read is:

1. one memory appears and settles
2. more memories awaken around it
3. the viewer briefly inhabits a quiet 3D field of shared photos
4. that field gathers back into the story and leads toward the final reveal

## Visual Thesis

Photos drift through a calm blue-violet memory galaxy while soft gold-white particles create depth around them. The photos remain warm and real. The world around them feels dreamlike, but the images themselves stay grounded and readable.

## Scene Structure

### Beat 1: Hero Photo Arrival

The scene begins with one photo arriving from deeper in space toward the center of the frame. The surrounding environment is minimal at first, with only a sparse field of distant particles.

Design intent:

- orient the viewer
- create focus
- avoid overwhelming the eye at the scene transition

### Beat 2: Memory Expansion

After the first photo settles, additional photos appear gradually at different depths and positions. These photos should not look like a grid or a carousel. They should feel suspended in a memory field.

Design intent:

- create spatial richness
- give the viewer time to read the images
- build emotional scale without chaos

### Beat 3: Memory Constellation

The scene reaches its fullest state here. Multiple photos float in front, behind, and around the focal zone, supported by layered particles and very slight camera drift.

Design intent:

- deliver the emotional high point of the memory scene
- maintain readability of each photo
- keep motion soft rather than theatrical

### Beat 4: Gathering And Return

Near the end of the scene, photos and particles begin to collect inward toward a shared focal point. This contraction prepares the handoff back to the `chest` scene.

Design intent:

- prevent the memory scene from ending abruptly
- create a story-like return to the main stage
- make the chest feel like the destination of the memories

## Three.js Responsibilities

Three.js should own:

- the memory-scene renderer
- camera
- particle field
- photo planes
- animation loop
- scene cleanup when leaving `memory`

Three.js should not own:

- the site's global scene engine
- subtitles outside the scene's own timing
- chest interaction
- proposal scene

## DOM And Three.js Boundary

The current DOM stage system remains the overall scene controller. The `memory` scene gets one dedicated container within the stage where a Three.js canvas mounts.

The rest of the app still handles:

- scene switching
- timing
- audio
- other stage scenes

This keeps the 3D work isolated and reduces risk.

## Photo Treatment

Each photo becomes a texture mapped onto a plane. The planes should read like elegant memory cards rather than literal paper prints.

Constraints:

- the main photo is larger and more front-facing
- secondary photos are smaller and offset in depth
- rotations stay subtle
- the viewer should always be able to comfortably read the current focal photo

## Particle Treatment

The particle system should support depth and atmosphere, not spectacle.

Preferred qualities:

- slow motion
- sparse near-field particles
- denser mid-field glow dust
- thin far-field star points

Avoid:

- thick fog that obscures photos
- fast swarming effects
- fireworks-like bursts

## Camera Motion

The camera should move only with a soft breathing motion.

Rules:

- no dramatic fly-through
- no rapid dolly or orbit
- small drift only
- camera motion must always be weaker than photo motion

This scene should feel contemplative, not kinetic.

## Color And Light

Background palette:

- deep blue
- indigo
- soft violet

Accent light:

- pale gold
- warm white

Photo treatment:

- keep the images themselves warm and legible
- do not over-blue the photo textures

## Performance Strategy

This is a laptop-first experience, but performance still matters.

Requirements:

- keep particle counts moderate
- keep texture sizes reasonable
- stop the Three.js render loop when leaving `memory`
- dispose of textures, materials, and geometry when the scene ends
- prefer visual clarity over particle volume

## Integration Strategy

The implementation should create a focused module structure, not a giant one-file Three.js script.

Recommended units:

- `memory` scene controller
- photo-plane creation
- particle system creation
- timeline update logic
- cleanup logic

## Testing Strategy

Success should be measured through a mix of structure checks and runtime verification.

Testing focus:

- the `memory` scene mounts a Three.js container only when active
- the scene tears down cleanly when leaving `memory`
- the autoplay still reaches `chest`
- the build remains green
- photos remain readable during motion

## Success Criteria

This design succeeds if:

- the memory scene feels clearly more magical than the current static photo grid
- the viewer still notices the photos first
- the transition from rescue to memory feels intentional
- the transition from memory back to chest feels smooth
- the 3D scene remains stable and readable on the target device
