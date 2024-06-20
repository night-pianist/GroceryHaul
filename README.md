# GroceryHaul
🛒💰🍎
## Overview
A website designed to make grocery trips efficient and affordable! Creates the ideal route with the best prices for all items on your shopping list!

## Contribution Workflow

1. Make sure your main branch is updated with other peoples' changes.
   ```
   git checkout main
   git pull
   ```

2. Make a new branch of this repository. `main` is a protected branch, **so you cannot push to it**.
   a. For branch naming, follow this convention: `<issue-number>_<change-you-made>` (e.g. `88_animate_cookies`).
   ```
   git checkout -b <your-branch-name>
   ```
3. Implement your code changes for your feature:
   - Before committing, run `npm lint`.
4. Once you're ready, stage and commit your changes.
   - Please include the # followed by the issue number in your commit message to create a reference.
   ```
   git commit -m <your-message>
   ```
5. Move your local branch changes to remote repository.
   **Before pushing**, make sure that your app builds with `npm run build`, without any errors.
   ```
   git push --set-upstream origin <your-branch-name>
   ```
6. Make a pull request with your changes, and let someone on your project team know. Assign a reviewer.
7. If your code passes code review, then we can **squash and merge** it into `main`. Congratulations! If you'd like, it's now safe to delete your branch locally.
