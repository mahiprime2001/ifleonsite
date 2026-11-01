-- Starting content for the portfolio, carried over from the old mahendra.ifleon.com page (the parts
-- that are still true) plus what IFLEON's site already says. Runs once: skipped if a profile exists.
-- Everything here is meant to be edited in the dashboard (Portfolio).
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
    'I build and run software end to end: the code, the servers it lives on, and the security around it.',
    E'I started out curious about how the computer world actually works, and I still learn that way: by building things and taking them apart.\n\nI studied computer science at Sree Venkateswara College of Engineering, and during a 2020 internship I learned how cyber attacks work and how to defend against them.\n\nIn 2022 I founded **IFLEON** (Infinite Logical Elements of Network), where we take on AI, DevOps, cloud and security work for businesses and individuals across India.\n\nOutside work I read mythology and novels, make videos for my YouTube channel, and travel whenever I can.',
    'Nellore, Andhra Pradesh, India',
    'mahendrareddy@ifleon.com',
    'Open to freelance work',
    '[{"label":"LinkedIn","url":"https://www.linkedin.com/in/mahendra-reddy-673525206/"},{"label":"GitHub","url":"https://github.com/mahiprime2001"},{"label":"IFLEON","url":"https://ifleon.com/"},{"label":"X","url":"https://twitter.com/Mahendr03628251"},{"label":"Instagram","url":"https://www.instagram.com/prime_of_e_o_n/"}]'::jsonb
  );

  INSERT INTO portfolio_entries (kind, slug, title, subtitle, start_date, end_date, location, summary, body, url, tags, is_featured, sort_order) VALUES
    ('experience', NULL, 'Founder', 'IFLEON', '2022', NULL, 'Nellore, India',
     'Started and run IFLEON, an engineering studio for AI, DevOps, cloud and security work.',
     E'- Lead client projects from first call to production\n- Built and self-host the company''s website and content dashboard',
     'https://ifleon.com/', '{"DevOps","Cloud","Security","AI"}', false, 0),
    ('experience', NULL, 'Cyber security intern', NULL, '2020', '2020', NULL,
     'Learned how attacks work and how to defend against them; completed mini and major projects.',
     E'- Three certificates: one for completing the internship, two for excellent performance',
     NULL, '{"Cyber security"}', false, 1),

    ('education', NULL, 'Bachelor of Computer Science', 'Sree Venkateswara College of Engineering', '2019', '2023', 'North Rajupalem, Nellore', NULL, NULL, NULL, '{}', false, 0),
    ('education', NULL, 'Schooling', 'Narayana Group of Schools', '2016', '2017', 'Nellore', NULL, NULL, NULL, '{}', false, 1),

    ('project', 'ifleon-website-and-dashboard', 'ifleon.com and its dashboard', 'IFLEON',
     '2026', NULL, NULL,
     'The company site and a self-hosted dashboard that manages its posts, testimonials, messages and this portfolio.',
     E'## What it is\n\nThe public site for IFLEON plus the dashboard behind it. Posts, testimonials, contact messages and this portfolio are all edited in the dashboard, and the sites read them through a small public API.\n\n## How it''s built\n\n- Next.js apps (site, dashboard, portfolio) with server rendering for search engines\n- PostgreSQL with Drizzle migrations\n- Docker containers on a VPS behind Nginx, with automatic backups and rollback on a failed deploy\n- GitHub Actions deploys over a restricted SSH key',
     'https://ifleon.com/', '{"Next.js","PostgreSQL","Docker","Nginx","GitHub Actions"}', true, 0),

    ('skill', NULL, 'DevOps & CI/CD', 'Cloud & DevOps', NULL, NULL, NULL, NULL, NULL, NULL, '{}', true, 0),
    ('skill', NULL, 'Docker', 'Cloud & DevOps', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 1),
    ('skill', NULL, 'Linux servers & Nginx', 'Cloud & DevOps', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 2),
    ('skill', NULL, 'Cloud migration', 'Cloud & DevOps', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 3),
    ('skill', NULL, 'Cyber security', 'Security & networks', NULL, NULL, NULL, NULL, NULL, NULL, '{}', true, 4),
    ('skill', NULL, 'Computer networking', 'Security & networks', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 5),
    ('skill', NULL, 'Python', 'Languages', NULL, NULL, NULL, NULL, NULL, NULL, '{}', true, 6),
    ('skill', NULL, 'TypeScript & JavaScript', 'Languages', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 7),
    ('skill', NULL, 'Java', 'Languages', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 8),
    ('skill', NULL, 'Web development (React, Next.js)', 'Web', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 9),
    ('skill', NULL, 'PostgreSQL & MySQL', 'Web', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 10),
    ('skill', NULL, 'AI integrations', 'AI', NULL, NULL, NULL, NULL, NULL, NULL, '{}', false, 11),

    ('certification', NULL, 'Internship completion', 'Cyber security internship', '2020', NULL, NULL, 'Plus two certificates for excellent performance during the internship.', NULL, NULL, '{}', false, 0);
END $$;
