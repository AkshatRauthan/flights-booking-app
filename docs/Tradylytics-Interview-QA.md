# Interview Questions & Answers — Tradylytics Backend Work

> Covers Tradylytics backend work across: `journaling-backend-service`, `auth-backend-service`, `tradylytics-journal`, and `tradylytics-auth`.
> This document is aligned with resume claims and framed for practical interview rounds (system design + backend deep dives + behavioral).

---

## 1) PROJECT OVERVIEW & ARCHITECTURE

### Q1. Can you explain your Tradylytics backend architecture at a high level?
**Answer:**
At a high level, Tradylytics backend was designed around microservice boundaries:
- **Auth domain** (`auth-backend-service`, `tradylytics-auth`): identity, token lifecycle, user/session security.
- **Journaling domain** (`journaling-backend-service`, `tradylytics-journal`): trading journal entries, metrics, portfolio/trade state views.

The primary design goals were:
1. support near real-time updates,
2. handle high-frequency ingestion from broker events,
3. keep query latency low for dashboard reads,
4. enforce secure auth boundaries.

The architecture favors event-driven processing (webhooks/WebSockets), caching (Redis), and denormalized read models for fast analytics responses.

---

### Q2. Why separate auth and journaling into different services?
**Answer:**
Because they have different scaling, security, and data-access patterns.
- **Auth** has stricter security controls, lower data volume, high sensitivity (tokens, credentials, sessions).
- **Journaling** is analytics-heavy with higher write/read throughput from trades and metrics queries.

Separation improves:
- independent scaling,
- independent deployments,
- smaller blast radius on failures,
- clearer ownership of schemas and APIs.

---

### Q3. What backend problems were you solving in Tradylytics?
**Answer:**
Main problems:
1. **Slow analytics queries** on large trade datasets.
2. **Redundant processing** for unchanged trade state.
3. **Complex ingestion** from multiple brokers with different payload formats.
4. **Real-time portfolio updates** without overloading core services.

Key outcomes from the resume-aligned work:
- schema denormalization reduced average query latency,
- ingestion optimization reduced processing time,
- metrics engine used aggregation pipelines + last-consistent-state logic,
- webhook/WebSocket integration enabled live updates.

---

### Q4. What would a typical request flow look like from login to viewing analytics?
**Answer:**
1. User logs in via auth API; receives access/refresh tokens.
2. Frontend calls journaling APIs with access token.
3. Journaling service validates token (direct verification or introspection depending on architecture).
4. Journaling service serves denormalized/aggregated metrics data, optionally with Redis-cached hot views.
5. Live updates arrive via WebSocket channel when new broker events are processed.

---

## 2) AUTH BACKEND DEEP DIVE

### Q5. What auth strategy did you follow and why?
**Answer:**
A token-based strategy with short-lived access tokens and longer-lived refresh tokens is typical for this architecture. It balances usability and security:
- access token: short TTL reduces breach window,
- refresh token: controlled renewal and rotation improves session continuity.

The most important security aspects are secure refresh rotation, token revocation support, and strict validation middleware.

---

### Q6. How do you implement refresh token rotation correctly?
**Answer:**
A robust approach:
1. On login, issue access + refresh token pair.
2. Persist refresh token metadata (`jti`, user, expiry, device/session context).
3. On refresh request, validate token and ensure it is current (not reused/revoked).
4. Invalidate old refresh token and issue a new pair atomically.
5. Detect reuse attempts and revoke session chain if suspicious.

This prevents replay attacks from stolen refresh tokens.

---

### Q7. What RBAC/authorization model would you use in Tradylytics auth?
**Answer:**
A role + permission model:
- roles map to business capabilities,
- fine-grained permissions map to action/resource pairs.

Middleware checks:
1. authentication (identity valid?),
2. authorization (can this identity perform this action?).

For auditability, denial reasons and actor context should be logged with request correlation metadata.

---

### Q8. How do you secure auth APIs against brute force and abuse?
**Answer:**
Layered controls:
- Redis-backed rate limiting (IP + account dimension),
- progressive backoff/temporary lockouts for repeated failures,
- consistent error messages (avoid username enumeration),
- secure password hashing (bcrypt/argon2 with strong parameters),
- optional MFA/OTP for sensitive actions.

---

### Q9. How would you design session invalidation (logout-all-devices)?
**Answer:**
Store refresh token/session records with device identifiers.
- Single-device logout: revoke one token family/session.
- Global logout: revoke all active sessions for user.
- Access token invalidation: short TTL + blocklist for high-risk scenarios.

This gives practical revocation without maintaining huge per-request lookup cost for every access token.

---

## 3) JOURNALING BACKEND & DATA DESIGN

### Q10. Your resume says you redesigned schema using denormalization. Why denormalize?
**Answer:**
In analytical and dashboard-heavy workloads, normalized schemas can cause many joins and slow query plans under scale. Denormalization precomputes/duplicates selected fields into read-friendly structures so common queries become direct indexed reads with minimal joins.

Trade-off: extra write complexity and potential staleness. I manage that via deterministic update pipelines and clear ownership of derived fields.

---

### Q11. What kind of denormalized fields/models are useful in trade journaling?
**Answer:**
Typical useful read-model fields:
- aggregate PnL per instrument/day/week,
- win-rate summaries,
- last-trade snapshot per strategy/instrument,
- precomputed risk/reward metrics,
- broker-normalized order status fields.

These avoid recomputing expensive metrics for every dashboard request.

---

### Q12. How did you reduce ingestion processing time by aggregating connected orders?
**Answer:**
Instead of processing each broker event independently end-to-end, connected events (same order chain, parent/child, partial fills) are grouped and resolved together. That cuts repeated lookups and repeated metric recalculation.

The optimization typically includes:
- deterministic correlation keys,
- staged normalization,
- batch/stream micro-aggregation before persistence,
- idempotent upsert to avoid duplicate processing.

---

### Q13. Explain “last consistent trade state” from your resume.
**Answer:**
It means the system tracks the latest fully-resolved state for each trade/order group and only recomputes downstream metrics when state transitions are meaningful.

If new events do not change effective state, the pipeline skips redundant recomputation. This saves CPU and DB resources and improves end-to-end latency.

---

### Q14. Why use aggregation pipelines for metrics calculation?
**Answer:**
Aggregation pipelines push computation closer to data and reduce application-side loops.
Benefits:
- lower network overhead,
- better use of DB indexes/operators,
- cleaner deterministic transforms,
- easier to reuse for scheduled recomputation jobs.

For high-frequency analytics, database-side aggregation is often more efficient than fetching raw rows and computing in Node.

---

### Q15. How do you keep denormalized data correct over time?
**Answer:**
A robust strategy combines:
1. write-path updates for immediate consistency where needed,
2. periodic reconciliation jobs to catch drift,
3. idempotent recomputation routines,
4. audit/version fields for traceability.

This gives fast reads with operational confidence.

---

## 4) BROKER INTEGRATIONS (FYERS, ANGELONE, 5PAISA)

### Q16. How do you integrate multiple brokers with different payload formats?
**Answer:**
Through a connector + normalization layer:
1. each broker has adapter/parser,
2. map broker-specific payload into a canonical internal event schema,
3. validate and enrich,
4. hand off to common ingestion pipeline.

This isolates vendor-specific complexity and keeps core journaling logic broker-agnostic.

---

### Q17. How do you handle webhook reliability and duplicate events?
**Answer:**
Use idempotency keys and dedup windows.
- Persist event fingerprint (`source + eventId + timestamp bucket`),
- reject replays/duplicates,
- process with at-least-once semantics safely.

Also verify webhook signatures and request origin to prevent spoofed broker callbacks.

---

### Q18. Why combine Webhooks and WebSockets?
**Answer:**
They solve different layers:
- **Webhooks** ingest external broker events into backend.
- **WebSockets** push processed updates from backend to client dashboard in near real time.

This pattern supports both reliable ingestion and responsive UX.

---

### Q19. How do you avoid flooding clients over WebSockets during market spikes?
**Answer:**
Use throttling/coalescing strategies:
- per-user/per-channel rate controls,
- diff-only updates instead of full payloads,
- short buffering windows (e.g., 100–300ms),
- backpressure handling and reconnect semantics.

This keeps UI smooth and backend stable during bursty traffic.

---

## 5) PERFORMANCE, CACHING, AND SCALING

### Q20. Where does Redis help in this architecture?
**Answer:**
Redis is useful for:
- auth rate-limiting counters,
- token/session metadata (if design requires),
- hot dashboard cache,
- pub/sub or lightweight coordination,
- transient dedup/event state windows.

It reduces DB load and improves p95 latency for repeated reads.

---

### Q21. What metrics would you track to prove latency improvements?
**Answer:**
Track before/after on:
- p50/p95/p99 API latency,
- query execution time by endpoint,
- DB CPU/utilization,
- cache hit rate,
- ingestion throughput and lag,
- end-to-end event-to-dashboard delay.

This ensures improvements are measurable, not anecdotal.

---

### Q22. How do you decide between cache-aside and write-through for metrics?
**Answer:**
- **Cache-aside** is simpler and good when occasional misses are acceptable.
- **Write-through** is useful when freshness is critical and writes can maintain cache deterministically.

For journaling analytics, a hybrid is common: write-through for critical summary tiles, cache-aside for exploratory queries.

---

### Q23. How do you scale ingestion workers safely?
**Answer:**
Scale consumers horizontally with partitioning keys (e.g., by user/account/order chain) to preserve ordering where needed. Ensure processing is idempotent and side effects are transactional so retries don’t corrupt state.

---

## 6) DATABASES (MONGODB + POSTGRESQL)

### Q24. Why both MongoDB and PostgreSQL in one backend ecosystem?
**Answer:**
Because different domains can benefit from different storage models:
- **PostgreSQL** for strong relational integrity, transactional auth/session metadata, and complex SQL reporting.
- **MongoDB** for flexible event-heavy journaling documents and evolving schemas.

Polyglot persistence is justified when domain needs are genuinely different.

---

### Q25. How do you design indexes for journaling workloads?
**Answer:**
Index design follows query patterns:
- account/user + time range,
- symbol/instrument + time,
- strategy tags,
- status/state transitions,
- unique dedup keys for events.

Too many indexes hurt write performance, so indexes are iteratively tuned with real query plans.

---

### Q26. What are common pitfalls in aggregation-heavy systems?
**Answer:**
- unbounded scans due to poor match stages,
- missing compound indexes,
- heavy pipeline stages before filters,
- repeated recomputation of immutable historical data,
- no partitioning/time-window discipline.

Fix by moving selective filters early, indexing join/filter keys, and caching/precomputing stable windows.

---

## 7) OBSERVABILITY, LOGGING, AND RELIABILITY

### Q27. What does “structured logging with Winston” give you in production?
**Answer:**
Structured JSON logs make debugging and auditing practical:
- filter by service, user, request ID, severity,
- aggregate in ELK/Datadog/Splunk,
- correlate auth + journaling flows,
- retain machine-parseable context for incident analysis.

It turns logs from plain text into searchable telemetry.

---

### Q28. Which fields are must-have in backend logs for Tradylytics?
**Answer:**
Recommended fields:
- timestamp, level, service, environment,
- correlation/request ID,
- user/account context (non-sensitive identifiers),
- endpoint/event type,
- latency,
- error code/class + stack (when safe),
- broker source metadata.

Never log secrets/tokens/PII in plaintext.

---

### Q29. How do you trace a user issue across auth and journaling services?
**Answer:**
Use propagated correlation IDs and consistent log fields.
1. Start from reported timestamp/user.
2. Find request ID in API gateway/auth logs.
3. Follow same ID through journaling ingestion and metrics computation.
4. Check event receipt, processing decisions, and final response.

This shortens mean time to resolution significantly.

---

### Q30. How would you design health checks for these services?
**Answer:**
- Liveness: process is running and event loop responsive.
- Readiness: dependencies (DB, Redis, broker streams) are reachable enough for safe traffic.
- Optional deep checks: queue lag thresholds, stale consumer detection.

Readiness should fail fast when dependencies are unavailable to avoid serving broken behavior.

---

## 8) SECURITY

### Q31. What are key security controls for broker-integrated finance backends?
**Answer:**
- webhook signature verification,
- strict authN/authZ on all APIs,
- token rotation and revocation,
- rate limiting + abuse detection,
- encryption in transit and at rest,
- secure secret management and key rotation,
- comprehensive audit logs.

Financial data systems should assume adversarial conditions by default.

---

### Q32. How do you prevent replay attacks on webhook endpoints?
**Answer:**
Use a combination of:
- signed payload with timestamp,
- narrow timestamp tolerance window,
- nonce/event ID dedup store,
- reject already-seen signatures/nonces.

This prevents old captured requests from being reused.

---

### Q33. What is the difference between authentication and authorization in your system?
**Answer:**
- **Authentication:** proving who you are (token/session validation).
- **Authorization:** proving what you can do (role/permission checks).

Both are separate middleware concerns and must not be conflated.

---

## 9) DEVOPS & DEPLOYMENT

### Q34. Why did you dockerize microservices, and what did it improve?
**Answer:**
Dockerization improved:
- environment consistency across local/CI/prod,
- faster onboarding,
- repeatable deployments,
- safer dependency packaging,
- easier horizontal scaling and rollback.

It also supports isolating service dependencies cleanly.

---

### Q35. How do you design CI checks for auth + journaling services?
**Answer:**
A practical CI pipeline should run:
1. lint + type checks,
2. unit tests,
3. integration tests with ephemeral dependencies,
4. security checks (dependency audit + secret scanning),
5. container build validation.

For analytics logic, include deterministic fixture-based tests for aggregation correctness.

---

### Q36. What rollout strategy would you use for risky metrics-engine changes?
**Answer:**
Use staged rollout:
- shadow compute mode (new and old logic both run),
- compare outputs,
- canary release to small traffic slice,
- feature flag rollback if mismatch/error budget breach.

This de-risks performance optimizations that may impact correctness.

---

## 10) BEHAVIORAL / OWNERSHIP QUESTIONS

### Q37. What’s one impactful optimization you’re proud of in Tradylytics?
**Answer (sample interview wording):**
“I redesigned parts of the journaling data model using denormalized read paths and optimized ingestion by grouping connected order events. That reduced average query latency and improved processing turnaround. The key was not just code changes but validating with query metrics and maintaining correctness through idempotent processing and reconciliation.”

---

### Q38. How did you balance speed and correctness in a trading context?
**Answer:**
I treated correctness as non-negotiable and performance as a controlled optimization problem:
- explicit invariants for state transitions,
- idempotent processing rules,
- measurement before/after optimization,
- rollback-safe deployments,
- audit-friendly logs for verification.

In trading systems, a fast wrong answer is worse than a slightly slower correct one.

---

### Q39. If asked “what did you personally own?”, what should you say?
**Answer (resume-aligned):**
“I worked on backend performance and reliability layers: schema denormalization for analytics reads, ingestion optimization for connected orders, metrics-engine improvements via aggregation and last-consistent-state logic, broker integration patterns via webhooks/WebSockets, and production engineering practices like Dockerized services and structured logging.”

---

### Q40. What would you improve next in Tradylytics backend?
**Answer:**
1. stronger event contracts (schema versioning + compatibility checks),
2. more formal stream processing guarantees,
3. richer SLO dashboards (event lag, metric freshness),
4. autoscaling policies tied to market-hour burst profiles,
5. deeper chaos testing for broker downtime and delayed webhooks.

---

## 11) RAPID-FIRE (SHORT ANSWERS)

### Q41. Why WebSocket over polling for live portfolio?
**Answer:** lower latency + reduced redundant request overhead.

### Q42. Why idempotency in ingestion?
**Answer:** broker retries/duplicates are common; idempotency prevents double effects.

### Q43. Why denormalization can hurt if overused?
**Answer:** higher write complexity, potential inconsistency drift, storage overhead.

### Q44. Why structured logs over plain console logs?
**Answer:** queryable machine-readable telemetry for production debugging.

### Q45. What is the first metric to check during incident triage?
**Answer:** end-to-end error rate and latency by service + dependency health.

### Q46. How do you validate aggregation correctness?
**Answer:** fixed fixtures, golden outputs, boundary-case tests, and reconciliation jobs.

### Q47. What is backpressure in event systems?
**Answer:** controlling producer/consumer imbalance so system doesn’t overload.

### Q48. Why separate write model and read model?
**Answer:** optimize each for its own workload and reduce query complexity.

### Q49. Why include correlation IDs in every service?
**Answer:** cross-service traceability for debugging and audits.

### Q50. Best practice for secrets in Dockerized services?
**Answer:** external secret manager/env injection; never hardcode or commit secrets.

---

## Final Interview Tip
When discussing Tradylytics work, always structure answers as:
1. **Problem context**,
2. **Technical decision and why**,
3. **Measurable impact**,
4. **Trade-offs and next improvements**.

That makes your answers credible, senior, and outcome-focused.

