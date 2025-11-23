# Git Commands & Workflow Guide for New Developers

Welcome to the project! This guide covers essential Git commands and workflows for working on this repository. Follow these steps to ensure smooth collaboration and code management.

---

## 1. Cloning the Repository

```sh
git clone https://github.com/yesuVaradala/ppt-export.git
cd ppt-export
```

---

## 2. Creating a New Branch

```sh
git checkout -b feature/your-feature-name
```

---

## 3. Adding & Committing Changes

```sh
git add .            # Stage all changes
git commit -m "Describe your changes"
```

---

## 4. Pushing Changes to Remote

```sh
git push -u origin feature/your-feature-name
```

---

## 5. Pulling Latest Changes

```sh
git pull origin main # Pull latest changes from main branch
git pull             # Pull latest changes from your current branch
```

---

## 6. Handling Merge Conflicts

- When you run `git pull` or `git merge` and see a conflict:
  1. Open the conflicted files in your editor.
  2. Look for sections marked with `<<<<<<<`, `=======`, and `>>>>>>>`.
  3. Edit the file to resolve the conflict.
  4. After resolving, run:
     ```sh
     git add <conflicted-file>
     git commit -m "Resolved merge conflict"
     ```

---

## 7. Rolling Back Changes

- Undo last commit (keep changes staged):
  ```sh
  git reset --soft HEAD~1
  ```
- Undo last commit (discard changes):
  ```sh
  git reset --hard HEAD~1
  ```
- Restore a file to last committed state:
  ```sh
  git checkout -- <filename>
  ```

---

## 8. Cherry-Picking Commits

- Apply a specific commit from another branch:
  ```sh
  git cherry-pick <commit-hash>
  ```

---

## 9. Stashing Changes

- Save your work temporarily:
  ```sh
  git stash
  ```
- Apply stashed changes:
  ```sh
  git stash pop
  ```

---

## 10. Deleting a Branch

- Local branch:
  ```sh
  git branch -d feature/your-feature-name
  ```
- Remote branch:
  ```sh
  git push origin --delete feature/your-feature-name
  ```

---

## 11. Viewing History & Status

```sh
git status           # See current changes
git log              # View commit history
git diff             # See unstaged changes
git diff --staged    # See staged changes
```

---

## 12. Best Practices

- Always pull latest changes before starting work.
- Commit often with clear messages.
- Use feature branches for new work.
- Resolve conflicts carefully and test after merging.
- Ask for help if unsure about any Git operation!

---

For more details, see the official [Git documentation](https://git-scm.com/doc).
