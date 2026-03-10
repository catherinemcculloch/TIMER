# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Focus Timer** is a vanilla HTML/CSS/JavaScript Pomodoro timer web application. It was built for the CAIL Spotlight Workshop and requires no build step or dependencies.

## Architecture

The app follows a simple three-file JavaScript architecture:

- **`js/timer.js`**: Core timer logic (start/pause/reset controls, 25min focus / 5min break cycle, interval management)
- **`js/helpers.js`**: Utility functions (`pad()`, `formatTime()`, `logSession()`)
- **`js/app-init.js`**: Configuration loading from `SiteConfig.json` on page load

**State Management**: Timer state is held in module-level variables in `timer.js` (remaining time, running status, focus/break mode). The DOM is the source of truth for UI display.

**Styling**: All styles consolidated in `css/styles.css`. The design uses a pink background (#ff69b4) with dark cards (#1a1a1a) and blue accent buttons (#5a8dee). Controls and timer display are centered in a card-based layout.

**Configuration**: `SiteConfig.json` controls page title, header text, and workshop name. `app-init.js` fetches this at runtime with graceful fallback if missing.

## Working with the Code

**No build step needed** — open `index.html` directly in a browser or serve over HTTP.

- **UI elements**: All defined in `index.html` with CSS classes
- **Event listeners**: Attached to buttons (start, pause, reset, apply-time) in `timer.js`
- **DOM queries**: Use `getElementById()` for timer display, buttons, inputs, and session log
- **Styling**: Modify `css/styles.css`; all styles consolidated from the original split files
- **Time editing**: Input fields (minutes/seconds) allow customizing duration before timer starts via `applyTime()`

## Key Constants

In `timer.js`:
- `FOCUS_MINUTES = 25`
- `BREAK_MINUTES = 5`

Change these to adjust the Pomodoro cycle duration.

## Time Editing

Users can customize timer duration before starting via input fields below the timer display:
- **`applyTime()`** — Reads minute/second inputs, validates (0-99 min, 0-59 sec), updates state
- **`syncInputs()`** — Updates input fields to match current remaining time (called on reset)
- Only allows editing when timer is not running (checked via `isRunning` flag)

## Session Logging

Completed focus/break sessions appear in the "Sessions" card below the timer. The `logSession()` helper creates entries with session type, duration, and timestamp. The empty state message auto-removes when the first session completes.

## Audio Chime

A 5-minute chime plays automatically during any timer session:
- **`playChime()`** — Uses Web Audio API to generate a two-tone chime (800Hz → 1000Hz)
- Triggered when `elapsedSeconds === 300` (5 minutes of running time)
- `chimeTriggered` flag prevents duplicate plays per session
- Fails gracefully if Web Audio API unavailable

**State variables** for chime tracking:
- `elapsedSeconds` — Counts up from 0 when timer starts
- `chimeTriggered` — Boolean flag; reset on new start/reset

## Extending the App

Common future additions:
- **End-of-session chime**: Play `playChime()` when `remaining <= 0` in addition to the 5-min chime
- **Persistent storage**: Use `localStorage` to save sessions and retrieve them on page load
- **Adjustable chime timing**: Move `300` (5 minutes) to a constant, let users configure trigger time
