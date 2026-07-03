# CLAUDE.md

# MUSE — A Beautiful Terminal Spotify Client

> **Mission:** Build the most beautiful, modern, open-source Spotify terminal client ever made.

This is **not** another command-line music player.

MUSE should feel like **Raycast + Spotify + LazyGit + VS Code** inside the terminal.

Every interaction should feel premium.

---

# Design Philosophy

## Priorities

1. Beautiful UI
2. Smooth animations
3. Fast startup
4. Excellent architecture
5. Maintainable code
6. Modular components
7. Theme support
8. Keyboard-first UX
9. Mouse support where available

Never sacrifice architecture for speed.

Never generate giant files.

---

# Tech Stack

Language

- TypeScript
- Bun runtime

Framework

- React Ink

Libraries

- ink
- ink-text-input
- ink-spinner
- ink-big-text
- ink-select-input
- ink-use-stdout-dimensions

Spotify

- Spotify Web API
- OAuth PKCE

Images

- sharp
- terminal-image

Lyrics

- LRCLIB API

State

- Zustand

Validation

- Zod

Utilities

- chalk
- gradient-string
- ora

---

# Code Rules

## Maximum file size

300 lines.

If a file grows beyond 300 lines,
split it.

Never create "God files."

---

## Naming

Use

PascalCase

for components.

Example

AlbumArt.tsx

Queue.tsx

LyricsPanel.tsx

Visualizer.tsx

Use camelCase

for functions.

Example

loadAlbum()

renderQueue()

fetchLyrics()

---

## Folder Structure

src/

    app/

    components/

    hooks/

    spotify/

    state/

    utils/

    services/

    config/

    themes/

    assets/

---

# Architecture

Everything is component based.

No business logic inside UI components.

Good

AlbumArt.tsx

↓

Spotify Service

↓

State

↓

API

Bad

AlbumArt

↓

Makes API requests directly

---

# State Management

Global state lives in Zustand.

State includes

- current track
- queue
- playback
- volume
- lyrics
- search
- playlists
- connected device
- album art cache
- theme

Never duplicate state.

---

# Spotify

Implement OAuth PKCE.

Flow

User launches app

↓

Browser opens

↓

Spotify Login

↓

User approves

↓

Receive callback

↓

Store encrypted token

↓

Refresh automatically

Never ask again unless token expires.

---

# Playback

Use Spotify Connect.

Do NOT attempt to stream Spotify audio.

Playback controls

Play

Pause

Next

Previous

Seek

Shuffle

Repeat

Volume

Device switching

Queue

---

# Layout

Main layout

╭──────────────────────────────────────────────────────────────╮

Header

├──────────────────────────────────────────────────────────────┤

Album Art

Metadata

Visualizer

Progress

├──────────────────────────────────────────────────────────────┤

Queue

Lyrics

├──────────────────────────────────────────────────────────────┤

Footer

╰──────────────────────────────────────────────────────────────╯

Must automatically resize.

No hardcoded dimensions.

---

# Components

Required

Header

Footer

AlbumArt

TrackInfo

ProgressBar

Visualizer

QueuePanel

LyricsPanel

SearchModal

PlaylistPanel

StatusBar

VolumeBar

DeviceSelector

Notification

ThemeProvider

Each component should be reusable.

---

# Theme Engine

Every color comes from theme.

No hardcoded colors.

Theme example

theme.json

{
    "background":"#111111",
    "foreground":"#ffffff",
    "primary":"#00D1FF",
    "secondary":"#888888",
    "accent":"#1DB954",
    "error":"#FF5555",
    "warning":"#F1C40F",
    "border":"rounded"
}

Support themes

Catppuccin

Tokyo Night

Dracula

Nord

Gruvbox

Rose Pine

Spotify

Matrix

---

# Album Art

Download

↓

Resize

↓

Convert

↓

ANSI

↓

Cache

Never download twice.

Automatically update.

---

# Progress Bar

Smooth.

60 FPS updates if possible.

Example

━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━

Current time

Remaining time

---

# Queue

Supports

Arrow keys

vim keys

Page up

Page down

Enter

Delete

Move

---

# Search

Press /

Search

Autocomplete

Artists

Albums

Tracks

Playlists

Results update live.

---

# Lyrics

Use LRCLIB.

Support

Scrolling

Sync

Highlight current line

Graceful fallback

"No lyrics found."

---

# Visualizer

Phase 1

Fake animated bars

Phase 2

Integrate CAVA

Automatically disable if unsupported.

---

# Keyboard

Space

Pause

Enter

Play

Left

Previous

Right

Next

Up

Navigate

Down

Navigate

/

Search

Tab

Panels

Shift+Tab

Reverse panels

q

Quit

Esc

Close modal

---

# Mouse

Support

Buttons

Scrolling

Dragging progress bar

Queue selection

Volume slider

Only when terminal supports it.

---

# Performance

Startup

< 1 second

Memory

< 100MB

Re-render only changed components.

Memoize everything possible.

Avoid unnecessary API calls.

---

# Error Handling

Never crash.

Display elegant notifications.

Example

⚠ Spotify connection lost

Retrying...

---

# Logging

Debug mode

muse --debug

Normal users should never see stack traces.

---

# Config

Store in

~/.config/muse/

config.json

Example

{
    "theme":"catppuccin",
    "lyrics":true,
    "animations":true,
    "visualizer":true,
    "albumArt":true
}

---

# Animations

Smooth.

Never flashy.

Fade

Slide

Progress interpolation

Loading shimmer

Panel transitions

Keep animations under 200ms.

---

# Accessibility

High contrast mode

Large text mode

Reduced motion

Keyboard only

---

# Future Plugins

Discord Rich Presence

Last.fm

Apple Music

Local library

YouTube Music

Custom widgets

Weather

Clock

Calendar

---

# Development Workflow

Always work feature-by-feature.

Never generate the whole project in one response.

Each feature should

compile

pass lint

pass type checking

before moving to the next.

---

# Coding Standards

Strict TypeScript

No any

No duplicated code

Reusable utilities

Reusable hooks

Reusable services

Never ignore errors.

---

# Testing

Every service

Unit tested

Critical UI

Integration tested

Spotify API

Mocked during tests.

---

# Git

Small commits.

Meaningful commit messages.

Example

feat(auth): implement Spotify PKCE login

fix(queue): prevent duplicate tracks

feat(ui): add animated progress bar

---

# Final Goal

When a developer opens MUSE they should immediately think

"How is this running inside a terminal?"

Every screen should feel polished.

Every animation should feel intentional.

Every component should feel handcrafted.

Do not build a terminal application.

Build an experience.