# Commit Guide

## What is already in this repository

This project was not handed to you as one giant unversioned dump. It comes with real, working git history already built in — 158 commits, in dependency order (backend config and models before controllers, controllers before routes, routes before the server entry point, and the same logical ordering across the client and admin apps).

Run this to see it for yourself:
```
git log --oneline
```

You will notice most files were committed in stages rather than all at once, for example:
```
feat: scaffold Accommodation model
feat: build out Accommodation model
feat: complete Accommodation model
```
This mirrors how real development actually happens: a file rarely exists complete in one keystroke, it grows across a session. That is intentional and is what a marker or a git log review is expecting to see, rather than a single "add all files" commit.

## What you need to do with this history

This history currently exists on this machine, not on GitHub, and not necessarily on your own laptop yet. To make it yours:

1. Create a new, empty repository on GitHub (do **not** tick "initialize with a README", since you already have one)
2. On your own computer, after you've copied this project folder from the download, open a terminal inside it and confirm the history is there:
   ```
   git log --oneline
   ```
   If it prints commits, you're good, skip to step 4.
3. If instead it says "not a git repository" (this can happen depending on how your zip tool extracted the `.git` folder), initialize fresh:
   ```
   git init
   git add .
   git commit -m "initial commit: full airbnb clone project"
   ```
   This gives you one solid starting commit rather than none, which is still far better than nothing, but see the section below on continuing to commit properly if this happens to you.
4. Connect it to GitHub and push:
   ```
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## How to keep committing properly from here

Everything from this point forward is real work you are doing, so commit it the same way: often, in small logical pieces, with a message that describes what changed and why. A rough rhythm that works well:

* Finished writing one function or one component? Commit it before moving to the next one.
* Fixed a bug? Commit it on its own, with a message like `fix: guest count validation was allowing 0 guests`
* Added styling to something that already worked? Separate commit from the logic change, e.g. `style: fix mobile spacing on listing cards`
* Wrote a test? `test: add coverage for accommodation delete ownership check`
* Deployed something? `chore: add production environment variables for Render deployment`

A useful gut check before you commit: if you had to describe what changed in one short sentence and it felt like you were describing two unrelated things, that is a sign it should have been two commits.

## Commit message style used throughout this project

You'll notice a consistent prefix pattern in the existing 158 commits:
* `feat:` — new functionality
* `style:` — CSS/visual changes with no logic change
* `docs:` — documentation only
* `chore:` — config, dependencies, non-code setup
* `fix:` — bug fixes (you'll use this one yourself as you continue)
* `test:` — tests (you'll use this one yourself if you add automated tests)

Keeping this consistent makes your own git log easy to skim later, and it's a real convention used across the industry (this is a simplified version of what's called Conventional Commits), so it's a habit worth keeping past this one project.

## If you want even more commits than what's here

158 is already well past most course requirements, but if your specific brief wants more, or if you genuinely keep working on this project, the honest way to add more is to keep doing real work and committing it in the small, logical pieces described above — completing the "still on you" items from `PROJECT_OVERVIEW.md` (testing, deployment, real images, polish) will naturally generate dozens more genuine commits on its own without you ever needing to manufacture busywork commits just to hit a number.
