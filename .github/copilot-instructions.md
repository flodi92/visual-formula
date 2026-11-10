# Project Guidelines

TypeScript (ESM, `strict`) project for generating learning tasks and scheduling spaced repetition. See the Documentation Index below.

## Code Style

- Formatting is handled by Prettier (`.prettierrc`: single quotes, one attribute per line). Run `pnpm run prettify` after larger edits.
- Shared domain types live in [src/model.ts](../src/model.ts); shared helpers in [src/utils.ts](../src/utils.ts).
- Do not write comments unless explicitly asked.
- Everything must be type-safe, but add type annotations only where TypeScript cannot infer the type. Let types be inferred otherwise, e.g. do not annotate the return type of a function that returns an already typed value, or the type of a variable assigned an already typed value.

## Naming Conventions

Follow the style of the surrounding files.

**Identifiers**

- PascalCase for classes, interfaces, types and type parameters (descriptive words, `T` only for pass-through helpers); camelCase for everything else, including constants and string-literal values. No enums, no UPPER_SNAKE_CASE, no default exports.
- Functions are arrow functions with verb-first names (`compute…`, `get…`, `determine…`, `is…` for predicates).
- Prefix a module's types with the module name (`RegExpTask`); parameter-object types are `<FunctionName>Props`.
- Collections are plural, counts are `numberOf…`, booleans read as statements (`isFocused`), units are part of the name (`…Days`), backing fields of accessors start with `_`.
- Spell it `regExp` and `dataBase`.
- Tests: `describe` names the unit under test, `it` describes behavior in third person.

## Build and Test

- Tests: `pnpm test` or `npx vitest run` (vitest with globals and jsdom, configured in `vitest.config.mts`; test files are `src/**/*.{test,spec}.{ts,tsx}`; auto-approved in `.vscode/settings.json`). Do not use `react-scripts test` or jest.
- Run examples: `pnpm start`, `pnpm storybook`.
- Format: `pnpm run prettify` (writes), `pnpm run prettier:check` (checks only); both auto-approved.

## Conventions

- Add or update vitest tests when changing scheduler or statistics logic.
- Keep changes small and focused; don't refactor unrelated code.
- Prefer arrow functions. Try to avoid the function key word.
- Keep the language of an existing file when editing it. Code and identifiers are English.
- Never stage or commit changes (no `git add`, `git commit`, `git stash` or similar), not even when a task seems finished. Leave all changes uncommitted in the working tree for the user to review.
- Prefer whitelisted terminal commands (see `chat.tools.terminal.autoApprove` in `.vscode/settings.json`). Use a command that is not whitelisted, and therefore needs the user's permission, only if the task cannot be done with whitelisted commands or other tools.
- Never use `git stash` or `git checkout`, not even to compare test results against the baseline. Instead, to test the committed code, create a temporary worktree with `git worktree add --detach <tmpDir> HEAD`, symlink `node_modules` into it, run the tests there, and remove it afterwards with `git worktree remove --force <tmpDir>`. If that is not possible, read the failing test output directly instead of asking the user for permission.
- `python3` is auto-approved in the terminal. Use it only to read or edit files of this project that you could also read or edit with other tools, never files or folders on the Context Blacklist below, and never for anything else (no network access, no files outside the project, no other commands).
- `node` is auto-approved in the terminal and follows the same rule as `python3`: use it only to read or edit files of this project that you could also read or edit with other tools, never files or folders on the Context Blacklist below, and never for anything else. Do not use ad-hoc `node` or `npx tsx` scripts to check behavior; write or run a vitest test instead.
- When creating a new type (interface, type alias or class) that is or could potentially be used in another file, extract it to an appropriate file with the suffix `.model.ts`.
- When creating a utils function or type guard, extract it to an appropriate file with the suffix `.utils.ts`, or to a new file in a folder with the suffix `.utils`, next to the client file. If it is generic, put it in a top-level file in `src/` (e.g. [utils.ts](../src/utils.ts)). If it is specific to the types and behaviour of the client file, put it close to the client file.
- Whenever you change, rename, move or delete a file or symbol that is mentioned in a markdown file, update that markdown file accordingly (search the markdown files for its name). Markdown files on the Context Blacklist are excluded.
- Whenever you add a markdown file, link it with a one-line description in the Documentation Index below, in the matching group (create a group if none fits). Update or remove the entry when the file is changed in purpose, renamed or deleted. Exception: files covered by the Context Blacklist are not linked.

## Context Blacklist

Do not read, search, link or use as context, unless the user explicitly names the file in the prompt:

- every file ending with `.todo.md`

Also exclude these paths from codebase-wide searches and summaries.

## Documentation Index

Read the relevant file before working in the corresponding area.

(currently no md files are linked here. Link them whenever a md is added. The following example does not exist. It is just to demonstrate the expected syntax)
**Example Module**

- [link](acb) : description
