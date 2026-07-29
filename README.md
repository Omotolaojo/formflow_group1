# Collaborative Workflow Guidelines

*This README will be replaced with the main Project README when we are done with the project* 

Welcome to our team (Group-1 Tech Crush - Cloud Engineers) repository!  
We follow a **two‑branch workflow** to ensure clean collaboration and stable deployments.

---

## 🔑 Branch Structure

- **main**  
  - Protected branch.  
  - Contains **stable, reviewed, production‑ready code**.  
  - No direct pushes allowed.  
  - Updates only happen via **Pull Requests (PRs)** from `dev`.

- **dev**  
  - Open collaboration branch.  
  - Everyone pushes their changes here.  
  - Serves as the staging ground before code is reviewed and merged into `main`.

---

## 🛠️ Workflow Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Checkout dev branch**
   ```bash
   git checkout -b dev origin/dev
   ```

3. **Pull latest dev changes**
   ```bash
   git pull origin dev
   ```

4. **Make your changes**
   - Edit files, add new code.
   - Stage and commit:
     ```bash
     git add .
     git commit -m "Meaningful commit message"
     ```

5. **Push to dev**
   ```bash
   git push origin dev
   ```

6. **Create a Pull Request**
   - Go to GitHub.
   - Open a PR from `dev` → `main`.
   - Add reviewers and a clear description.

7. **Review & Merge**
   - Team reviews the PR.
   - Once approved, merge into `main`.
   - `main` stays stable and protected.

---

## ✅ Best Practices

- **Always pull from `dev`** before starting new work to avoid conflicts.  
- **Never push directly to `main`** — only via PRs.  
- **Write clear commit messages** that explain what changed.  
- **Keep PRs small and focused** — easier to review and merge.  
- **Review actively** — every team member should participate in code reviews.  
- **Sync regularly** — multiple contributors mean frequent pulls reduce merge headaches.  

---

## 🚀 Optional Enhancements
  
- Use GitHub Issues to track tasks and assign responsibilities.  

---

## 📌 Summary

- Work on `dev`.  
- Push to `dev`.  
- Create PR → `main`.  
- Review → Merge → Deploy.  

This ensures smooth collaboration, stable releases, and a professional workflow for our team.
---