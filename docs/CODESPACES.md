# GitHub Codespaces

1. Open the repository and choose **Code → Codespaces → Create codespace on main**.
2. Wait for `postCreateCommand` to install dependencies, initialize PostgreSQL, and seed synthetic data.
3. Port 3000 opens as a private forwarded port named **CareerOS Dashboard**.
4. If it does not open automatically, use the **Ports** panel and select **Open in Browser** for port 3000.

Services start automatically on every Codespace restart. Runtime logs are available at `/tmp/careeros-web.log` and `/tmp/careeros-worker.log`.

Private files `config/candidate.local.json` and `config/answers.local.json` are created from examples and remain ignored by Git.
