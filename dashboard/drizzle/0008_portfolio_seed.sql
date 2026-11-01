-- Starting content for the portfolio: what is still true from the old mahendra.ifleon.com page, what
-- IFLEON's site says, and the public repos on github.com/mahiprime2001 and github.com/ifleonlabs.
-- Runs once: skipped if a profile exists. Everything here is meant to be edited in the dashboard.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM portfolio_profile) THEN
    RETURN;
  END IF;

  INSERT INTO portfolio_profile (id, name, headline, intro, bio, location, email, availability, links)
  VALUES (
    1,
    'S. Mahendra Reddy',
    'Founder of IFLEON · Software, DevOps & security engineer',
    'I build and run software end to end: desktop apps, web platforms, developer tools, and the servers and security around them.',
    E'I started out curious about how the computer world actually works, and I still learn that way: by building things and taking them apart.\n\nI studied computer science at Sree Venkateswara College of Engineering, and during a 2020 internship I learned how cyber attacks work and how to defend against them.\n\nIn 2022 I founded **IFLEON** (Infinite Logical Elements of Network), where we take on AI, DevOps, cloud and security work for businesses and individuals across India. Alongside client work I build in the open: billing software, a peer-to-peer chat app, a workspace platform, and a family of small, well-tested Python libraries under IFLEON Labs.\n\nOutside work I read mythology and novels, make videos for my YouTube channel, and travel whenever I can.',
    'Nellore, Andhra Pradesh, India',
    'mahendrareddy@ifleon.com',
    'Open to freelance work',
    '[{"label":"LinkedIn","url":"https://www.linkedin.com/in/mahendra-reddy-673525206/"},{"label":"GitHub","url":"https://github.com/mahiprime2001"},{"label":"IFLEON Labs","url":"https://github.com/ifleonlabs"},{"label":"IFLEON","url":"https://ifleon.com/"}]'::jsonb
  );

  -- Projects (featured ones lead the home page).
  INSERT INTO portfolio_entries (kind, slug, title, subtitle, start_date, end_date, summary, body, url, repo_url, tags, is_featured, sort_order) VALUES
    ('project', 'siri-billing-app', 'Siri Billing App', 'IFLEON partnership', '2025', NULL,
     'An inventory and billing desktop app: products with barcodes, customers, invoices and sales history.',
     E'## What it does\n\n- Product management with names, prices and barcodes\n- A customer list with contact details\n- Billing: add items to a cart, generate invoices, take payments\n- Billing history to look up and manage past sales\n- Login for staff\n\n## How it''s built\n\nA Next.js and TypeScript interface packaged as a desktop app with **Tauri**, a Python (Flask) API behind it, and SQLite for local data.',
     NULL, 'https://github.com/mahiprime2001/Siri-billing-app', '{"Tauri","Next.js","TypeScript","Python","Flask","SQLite"}', true, 0),

    ('project', 'loom', 'Loom', 'Personal project', '2026', NULL,
     'Peer-to-peer chat over a Kademlia DHT: no central server holds messages, contacts or accounts.',
     E'## The idea\n\nMessages travel directly between devices. Peers find each other on a public DHT (the same family of technology BitTorrent uses), so no server ever sees message content, contact lists, or who is talking to whom.\n\n## How it works\n\n- **Identity** is a keypair generated from a 12-word recovery phrase (BIP39), never stored by the app\n- **Discovery** by peer ID or an opt-in username on the DHT\n- **No phone number, no OTP, no account server.** An optional Google sign-in only stores an *encrypted* copy of the recovery phrase in your own Google Drive\n\n## Status\n\nAn early prototype: peer-to-peer messaging, contact requests and account recovery work and are tested. NAT traversal, offline delivery and calls are next.',
     NULL, 'https://github.com/mahiprime2001/loom', '{"Go","Flutter","Dart","Kademlia DHT","Cryptography"}', true, 1),

    ('project', 'arna', 'Arna', 'Workspace platform', '2026', NULL,
     'Lend your computer''s power, not your computer: share compute and storage as isolated workspaces.',
     E'## The idea\n\nA host shares compute, storage and selected resources with people they invite, as isolated **workspaces** rather than remote control of their desktop. A workspace has its own screen, input, clipboard, filesystem and processes; the host keeps using their machine and stays in control.\n\n> A workspace is a place, not a connection.\n\n## Approach\n\nSpecification first. The platform spec is frozen at v1.0, and architecture decisions are recorded as ADRs. Platform adapters implement the spec per operating system, so nothing above the adapter boundary names an OS.\n\nThe public site runs at arna.ifleon.com (Vue, Tailwind, Docker behind Nginx).',
     'https://arna.ifleon.com', 'https://github.com/mahiprime2001/arna', '{"Rust","Go","System design","Vue","Docker"}', true, 2),

    ('project', 'ifleon-website-and-dashboard', 'ifleon.com and its dashboard', 'IFLEON', '2025', NULL,
     'The company site plus a self-hosted dashboard that manages its posts, testimonials, messages and this portfolio.',
     E'## What it is\n\nThe public site for IFLEON and the dashboard behind it. Posts, testimonials, contact messages and this portfolio are all edited in the dashboard, and the sites read them through a small public API.\n\n## How it''s built\n\n- Next.js apps (site, dashboard, portfolio) with server rendering for search engines\n- PostgreSQL with Drizzle migrations\n- An AI writer that drafts posts with several model providers\n- Docker containers on a VPS behind Nginx, with database backups and automatic rollback on a failed deploy\n- GitHub Actions deploys over a restricted SSH key',
     'https://ifleon.com/', 'https://github.com/mahiprime2001/ifleonsite', '{"Next.js","PostgreSQL","Drizzle","Docker","Nginx","GitHub Actions"}', true, 3),

    ('project', 'ai-toolkit', 'AI toolkit on the Claude API', 'IFLEON Labs', '2026', NULL,
     'Small, typed Python libraries for building with LLMs, and apps built from them, all testable offline.',
     E'A set of libraries that fit together:\n\n- **llmkit**: chat and streaming, prompt templates, response and prompt caching, token usage, and an offline mock provider\n- **ragstore**: text retrieval with BM25, pluggable embeddings, cosine search and hybrid fusion, with no runtime dependencies\n- **agentkit**: a tool-calling agent loop (ReAct): register tools and let the model reason and act\n\nAnd apps assembled from them:\n\n- **askdocs**: ask questions over your own documents (RAG)\n- **sage**: a terminal second brain that answers from your notes',
     NULL, 'https://github.com/ifleonlabs/llmkit', '{"Python","Claude API","RAG","Agents","Testing"}', false, 4),

    ('project', 'python-service-toolkit', 'Service toolkit: apikit, taskq, notifykit', 'IFLEON Labs', '2026', NULL,
     'The engine parts behind IFLEON Labs apps: an API client, a job queue and notifications, plus the apps built on them.',
     E'- **apikit**: a typed REST client on httpx with retries and backoff, rate limiting, caching and pagination\n- **taskq**: a persistent background job queue on SQLite with retries, scheduling and priorities, no Redis needed\n- **notifykit**: fan-out notifications to webhooks, console or custom channels, with per-channel error isolation\n\nBuilt from them:\n\n- **vigil**: an uptime and change monitoring service (FastAPI, SQLModel, JWT auth)\n- **roundup**: a content aggregator that pulls RSS/JSON sources on a schedule, de-duplicates them and sends digests',
     NULL, 'https://github.com/ifleonlabs/vigil', '{"Python","FastAPI","SQLModel","httpx","SQLite"}', false, 5),

    ('project', 'billing-app', 'Billing App', 'IFLEON partnership', '2025', NULL,
     'An admin billing application for bills, products, stores and users, running on Windows, macOS and Linux.',
     E'- A dashboard with analytics across billing, products, stores and users\n- Create, view and update bills\n- Manage products, stores and users\n- Secure login with hashed passwords, and a full API behind the interface\n\nBuilt with Next.js, Radix UI and Tailwind CSS, validated with Zod, stored in MySQL, and packaged as a desktop app with Tauri.',
     NULL, 'https://github.com/mahiprime2001/billing-app', '{"Next.js","TypeScript","Tauri","MySQL","Zod","Tailwind CSS"}', false, 6),

    ('project', 'pebble', 'Pebble', 'IFLEON Labs', '2026', NULL,
     'A tiny scripting language written from scratch: lexer, parser, AST and a tree-walking interpreter.',
     E'Variables, control flow, and functions with closures, built step by step: a lexer, a recursive-descent parser that produces an AST, and a tree-walking interpreter that runs it.',
     NULL, 'https://github.com/ifleonlabs/pebble', '{"Python","Interpreters","Parsing"}', false, 7),

    ('project', 'python-projects-series', 'Python projects series', 'Personal project', '2026', NULL,
     'A numbered series of complete Python projects, from a CLI to-do app to a real-time chat server.',
     E'1. **todo-cli**: a friendly command-line to-do manager (Typer, Rich, uv)\n2. **weather-app**: live weather and forecasts from Open-Meteo, as a CLI and web UI (async httpx, caching)\n3. **url-shortener**: short links with click analytics, CLI, web UI and redirect server (SQLModel)\n4. **auth-api**: a FastAPI authentication service with bcrypt, JWT access/refresh tokens and OAuth2\n5. **realtime-chat**: WebSocket chat with rooms, live presence and saved history (FastAPI)\n6. **tablescope**: profile, aggregate, chart and report on any CSV from the command line (pandas, matplotlib)',
     NULL, 'https://github.com/ifleonlabs/realtime-chat', '{"Python","FastAPI","WebSockets","JWT","pandas"}', false, 8),

    ('project', 'developer-tools', 'Developer tools: markit and shiplog', 'IFLEON Labs', '2026', NULL,
     'A static site generator and a changelog generator, both small and dependable.',
     E'- **markit**: turns a folder of Markdown into a styled website, with Jinja2 themes and a live-rebuild dev server, and no JavaScript\n- **shiplog**: builds a clean, grouped Markdown changelog from git history (Conventional Commits), since the last tag or between any two refs',
     NULL, 'https://github.com/ifleonlabs/markit', '{"Python","Jinja2","Git","CLI"}', false, 9),

    ('project', 'siri-art-jewellery-website', 'Siri Art Jewellery website', 'Siri Art Jewellery', '2026', NULL,
     'The web storefront for Siri Art Jewellery.',
     NULL,
     NULL, 'https://github.com/mahiprime2001/siri-website', '{"Vue","TypeScript","Vite","Docker"}', false, 10),

    ('project', 'ghostly-404-page', 'Ghostly 404 page', 'Personal project', '2024', NULL,
     'A playful 404 page whose ghost follows your mouse, with a friendly way back.',
     NULL,
     'https://ifleon.com/test/404%20web%20page/index.html', 'https://github.com/mahiprime2001/Ghostly-404-web-page', '{"HTML","CSS","JavaScript"}', false, 11);

  INSERT INTO portfolio_entries (kind, title, subtitle, start_date, end_date, location, summary, body, url, tags, sort_order) VALUES
    ('experience', 'Founder', 'IFLEON', '2022', NULL, 'Nellore, India',
     'Started and run IFLEON, an engineering studio for AI, DevOps, cloud and security work.',
     E'- Lead client projects from first call to production, including desktop billing and inventory software\n- Built and self-host the company''s website, content dashboard and deployment pipeline\n- Publish open-source Python libraries and tools under IFLEON Labs',
     'https://ifleon.com/', '{"DevOps","Cloud","Security","AI"}', 0),
    ('experience', 'Cyber security intern', NULL, '2020', '2020', NULL,
     'Learned how attacks work and how to defend against them; completed mini and major projects.',
     E'- Three certificates: one for completing the internship, two for excellent performance',
     NULL, '{"Cyber security"}', 1),

    ('education', 'Bachelor of Computer Science', 'Sree Venkateswara College of Engineering', '2019', '2023', 'North Rajupalem, Nellore', NULL, NULL, NULL, '{}', 0),
    ('education', 'Schooling', 'Narayana Group of Schools', '2016', '2017', 'Nellore', NULL, NULL, NULL, '{}', 1),

    ('certification', 'Internship completion', 'Cyber security internship', '2020', NULL, NULL, 'Plus two certificates for excellent performance during the internship.', NULL, NULL, '{}', 0);

  -- Skills, grouped by subtitle; featured ones are highlighted.
  INSERT INTO portfolio_entries (kind, title, subtitle, is_featured, sort_order) VALUES
    ('skill', 'Python', 'Languages', true, 0),
    ('skill', 'TypeScript', 'Languages', true, 1),
    ('skill', 'JavaScript', 'Languages', false, 2),
    ('skill', 'Go', 'Languages', false, 3),
    ('skill', 'Rust', 'Languages', false, 4),
    ('skill', 'Dart', 'Languages', false, 5),
    ('skill', 'SQL', 'Languages', false, 6),
    ('skill', 'Java', 'Languages', false, 7),

    ('skill', 'Next.js', 'Web & apps', true, 8),
    ('skill', 'React', 'Web & apps', false, 9),
    ('skill', 'Vue', 'Web & apps', false, 10),
    ('skill', 'Tailwind CSS', 'Web & apps', false, 11),
    ('skill', 'Tauri (desktop apps)', 'Web & apps', false, 12),
    ('skill', 'Flutter', 'Web & apps', false, 13),

    ('skill', 'FastAPI', 'Backend & data', true, 14),
    ('skill', 'Flask', 'Backend & data', false, 15),
    ('skill', 'REST API design', 'Backend & data', false, 16),
    ('skill', 'WebSockets', 'Backend & data', false, 17),
    ('skill', 'PostgreSQL', 'Backend & data', false, 18),
    ('skill', 'MySQL', 'Backend & data', false, 19),
    ('skill', 'SQLite', 'Backend & data', false, 20),
    ('skill', 'Background jobs & queues', 'Backend & data', false, 21),

    ('skill', 'Docker', 'Cloud & DevOps', true, 22),
    ('skill', 'GitHub Actions (CI/CD)', 'Cloud & DevOps', false, 23),
    ('skill', 'Linux servers', 'Cloud & DevOps', false, 24),
    ('skill', 'Nginx', 'Cloud & DevOps', false, 25),
    ('skill', 'Self-hosting on a VPS', 'Cloud & DevOps', false, 26),
    ('skill', 'Cloud migration', 'Cloud & DevOps', false, 27),

    ('skill', 'Claude API & LLM apps', 'AI', true, 28),
    ('skill', 'RAG (retrieval)', 'AI', false, 29),
    ('skill', 'Tool-using agents', 'AI', false, 30),

    ('skill', 'Cyber security', 'Security & networks', true, 31),
    ('skill', 'Authentication (JWT, OAuth2)', 'Security & networks', false, 32),
    ('skill', 'Applied cryptography', 'Security & networks', false, 33),
    ('skill', 'Peer-to-peer networking', 'Security & networks', false, 34),
    ('skill', 'Computer networking', 'Security & networks', false, 35);
END $$;
