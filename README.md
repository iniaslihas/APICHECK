# CYBERSEC — API Status Dashboard - APICHECK 
*“Open-source visibility for every defender”*

---

## 🔦 Why CYBERSEC built this

Modern infrastructures run on dozens of micro-services, third-party APIs and cloud endpoints.  
When one of them silently fails, the blast-radius can be **customer data loss, SLA breaches or full-blown outages**.

CYBERSEC created this lightweight, **self-hosted dashboard** to:

- give **SOC teams** a single pane of glass for all external dependencies  
- let **developers** catch breaking changes **before** they reach production  
- offer **small companies** the same uptime visibility **Fortune-500** teams enjoy — **without a vendor bill**

> We believe defensive tooling should be **public, auditable and community-driven**.  
> Open-sourcing this project accelerates global security posture while keeping **zero vendor lock-in**.

---

## 🏗️ Architecture at a glance

| Layer        | Tech Stack                               | Purpose                                   |
|--------------|-------------------------------------------|-------------------------------------------|
| **Backend**  | Go 1.22 + SQLite + JWT                    | High-throughput polling, RBAC, REST API   |
| **Frontend** | React + Vite + Tailwind + Recharts        | Real-time UI, responsive, charts          |
| **Storage**  | SQLite (single binary)                    | 100 % portable, zero-config               |
| **Auth**     | JWT + bcrypt                              | Multi-user, role-based (admin / viewer)   |

---

## 🚀 Quick start (≤ 2 min)

### 1. Clone & run backend
```bash
git clone https://github.com/cybersec/api-status-dashboard.git
cd api-status-dashboard/backend
go run .
# Backend spins up on :8080 with default admin (admin / admin)
```

### 2. Launch frontend
```bash
cd ../frontend
npm install
npm run dev
# Dashboard opens at http://localhost:3000
```

### 3. Add your first endpoint
- Login → **Add API**  
- URL: `https://api.github.com/zen`, interval: `60 s`, expect 200  
- Within one minute you’ll see **UP** and response-time sparklines.

---

## 👥 Contributing

We follow **open-source-first** principles:

- **Issues & PRs welcome**  
- **Security** disclosures handled via GitHub private advisories  
- **Roadmap** driven by community votes

---

## 🛡️ How this helps your security program

| Use-case                     | Benefit delivered                                |
|------------------------------|--------------------------------------------------|
| **Third-party SLA monitoring** | Early warning before vendor outages hit customers |
| **CI/CD gate**               | Block promotions when key APIs are down          |
| **Compliance (ISO 27001, SOC 2)** | Auditable uptime evidence & incident logs        |
| **Red-team / Blue-team exercises** | Simulate API failure during drills               |

---

## 📄 License

MIT — **free for commercial & personal use**.  
See [LICENSE](LICENSE) for details.

---

> “Open source is not the enemy of security — it is the **multiplier** of it.”  
> — CYBERSEC Team
