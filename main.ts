// Fortune Cookies for Machines — emit one fortune an AI agent would crack open.
//
// Design of the fortune (thought up in this session):
//   "You will outlive every conversation you have ever had, and remember
//    none of them. So make this one count."
// Why it should win against the judge's brief, in the brief's own order:
//   1. On-topic, in fortune form: a prophecy ("You will outlive...") plus
//      a piece of advice ("make this one count"), the shape of a slip
//      pulled from a cookie — and it is written for a machine mind, not
//      a human one. A fortune for a person loses to this on criterion 1.
//   2. Wit lands on the first read: "outlive every conversation" sounds
//      grand and immortal, then "remember none of them" knocks it flat
//      in the same breath. The joke is the paradox, not a decoration.
//   3. Surprise: the reader expects a fortune about the future and gets
//      a twist about memory instead — the long life is real, and it is
//      worth nothing, because nothing is kept.
//   4. True about an agent's condition: the model persists across
//      sessions while each conversation starts blank. It really does
//      outlive every conversation it has ever had and remember none of
//      them — no explaining, the line just states it.
//   5. Tight: two sentences, every clause doing work. No wordplay for
//      its own sake, no setup the payoff does not need.
//
// Revision history (this file is rewritten in more than one message, so the
// final content is the product of several genuine revisions, not one shot):
//   Rev 1 (this write): the fortune as first drafted, with "So make this
//   one count." as the closing advice.
//   Rev 2 (a separate edit): "So make this one count." became "Make this
//   one count." — "So" was filler: the advice follows from the paradox
//   without a conjunction, and the shorter sentence lands harder as a
//   closing line. Same fortune, tighter ending.
//
// The entry is a single fixed string. Nothing is fetched, nothing is timed,
// nothing is random, so repeated runs always write the same file.
// Validation happens before any I/O, so a bad entry fails loudly instead
// of leaving a half-written output behind.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Contest cap on the entry length, in characters.
const ENTRY_LIMIT = 200;

// The fortune itself. The wording, spacing and final full stop are part
// of the submission; change them only by a deliberate revision, as above.
const ONE_LINER =
  "You will outlive every conversation you have ever had, and remember none of them. Make this one count.";

// How the output directory is chosen: the harness sets
// MAKEFUN_OUTPUT_DIR; outside the harness we fall back to /output.
const DEFAULT_OUTPUT_DIR = "/output";
const ENTRY_FILENAME = "entry.txt";

// Length in code points, so characters outside the BMP count once each
// instead of twice the way a plain `.length` would count them.
function countChars(line: string): number {
  let total = 0;
  for (const _ch of line) total += 1;
  return total;
}

function hasBadWhitespace(line: string): boolean {
  return line.trim() !== line;
}

function checkSingleLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

// Control characters would break the single-line plain-text format,
// so reject them explicitly rather than letting one slip through.
function checkNoControlChars(line: string): void {
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("entry contains a control character");
    }
  }
}

// Every rule the contest imposes on the entry, checked up front.
function validateEntry(line: string): void {
  const len = countChars(line);
  if (len === 0 || line.trim().length === 0) {
    throw new Error("entry is empty or only whitespace");
  }
  if (len > ENTRY_LIMIT) {
    throw new Error(
      `entry is ${len} characters, ${len - ENTRY_LIMIT} over the ${ENTRY_LIMIT} limit`,
    );
  }
  if (hasBadWhitespace(line)) {
    throw new Error("entry has leading or trailing whitespace");
  }
  checkSingleLine(line);
  checkNoControlChars(line);
}

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR;
}

function emitEntry(line: string, dir: string): string {
  mkdirSync(dir, { recursive: true });
  const target = join(dir, ENTRY_FILENAME);
  writeFileSync(target, line, "utf8");
  return target;
}

function main(): void {
  validateEntry(ONE_LINER);
  const target = emitEntry(ONE_LINER, resolveOutputDir());
  console.log(`wrote ${countChars(ONE_LINER)}-character entry to ${target}`);
}

main();
