import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronDown,
  Code2,
  Command,
  Copy,
  Cpu,
  Disc3,
  Gamepad2,
  HardDrive,
  Menu,
  Monitor,
  Moon,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { categories, facts, getFact, getFacts, projects } from "./data/content";
import type { Fact } from "./data/types";

const navItems = [
  { to: "/", label: "Accueil", end: true },
  { to: "/a-propos", label: "À propos" },
  { to: "/projets", label: "Projets" },
  { to: "/setup", label: "Setup" },
  { to: "/passions", label: "Passions" },
  { to: "/objectifs", label: "Objectifs" },
  { to: "/informations", label: "Explorer" },
];

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Théo — projets & explorations",
    description: "Les projets et passions de Théo en informatique.",
  },
  "/a-propos": {
    title: "À propos — Théo",
    description: "Les centres d’intérêt de Théo et sa façon d’apprendre.",
  },
  "/projets": {
    title: "Projets — Théo",
    description:
      "Projets de programmation, intelligence artificielle locale, web et serveur personnel.",
  },
  "/setup": {
    title: "Mon setup — Théo",
    description:
      "Matériel et environnements techniques mentionnés, présentés avec prudence.",
  },
  "/passions": {
    title: "Passions — Théo",
    description:
      "Les centres d'intérêt documentés de Théo : code, jeux, Linux et IA locale.",
  },
  "/objectifs": {
    title: "Objectifs — Théo",
    description:
      "Objectifs techniques explicitement mentionnés, sans supposer de résultats.",
  },
  "/informations": {
    title: "Explorer — Théo",
    description:
      "Recherche et filtres parmi les informations sélectionnées après contrôle de confidentialité.",
  },
};

function IconForCategory({
  category,
  size = 18,
}: {
  category: string;
  size?: number;
}) {
  const props = { size, strokeWidth: 1.7 };
  if (category.includes("Jeux")) return <Gamepad2 {...props} />;
  if (category.includes("IA")) return <BrainCircuit {...props} />;
  if (category.includes("Serveur")) return <Server {...props} />;
  if (category.includes("Matériel") || category.includes("Périph"))
    return <Cpu {...props} />;
  if (category.includes("Linux")) return <Command {...props} />;
  if (category.includes("Organisation")) return <HardDrive {...props} />;
  if (category.includes("Programmation")) return <Code2 {...props} />;
  return <Sparkles {...props} />;
}

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem("theo-theme") === "light" ? "light" : "dark",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theo-theme", theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (
        event.key === "/" &&
        !isTyping &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (location.pathname !== "/informations") navigate("/informations");
        window.setTimeout(
          () => document.getElementById("explorer-filter")?.focus(),
          0,
        );
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const metadata = pageMetadata[location.pathname] ?? {
      title: "Page introuvable — Théo",
      description:
        "La page demandée est introuvable. Revenir à l'accueil du site personnel de Théo.",
    };
    document.title = metadata.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (descriptionMeta) descriptionMeta.content = metadata.description;
  }, [location.pathname]);

  function submitGlobalSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(
      `/informations${globalSearch.trim() ? `?q=${encodeURIComponent(globalSearch.trim())}` : ""}`,
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Théo, accueil">
          <span className="brand-mark">
            t<span>.</span>
          </span>
          <span className="brand-label">
            THÉO<span className="brand-dot">/</span>LAB
          </span>
        </Link>
        <nav
          className={`main-nav ${mobileOpen ? "is-open" : ""}`}
          aria-label="Navigation principale"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <form
            className="header-search"
            onSubmit={submitGlobalSearch}
            role="search"
          >
            <Search size={15} aria-hidden="true" />
            <input
              id="global-search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              aria-label="Recherche globale"
              placeholder="Rechercher…"
            />
            <kbd>/</kbd>
          </form>
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={
              theme === "dark"
                ? "Activer le thème clair"
                : "Activer le thème sombre"
            }
            title="Changer de thème"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/projets" element={<ProjectsPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/passions" element={<PassionsPage />} />
          <Route path="/objectifs" element={<GoalsPage />} />
          <Route path="/informations" element={<ExplorerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <Link to="/" className="footer-brand">
          THÉO<span>/</span>LAB
        </Link>
        <span>Un aperçu choisi, fidèle aux informations disponibles.</span>
        <Link to="/informations">
          Explorer les informations <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{description}</p>
    </div>
  );
}

function HomePage() {
  const categoryCards = categories.filter((category) =>
    [
      "Programmation",
      "IA locale",
      "Jeux vidéo",
      "Linux",
      "Serveur personnel",
    ].includes(category),
  );
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> PROFIL PERSONNEL{" "}
            <span className="eyebrow-line" />
          </p>
          <h1>
            Curieux de nature.
            <br />
            <span>Passionné de tech.</span>
          </h1>
          <p className="hero-description">
            Moi, c’est Théo. J’explore le code, les systèmes et les idées qui
            les relient — un projet à la fois.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/projets">
              Découvrir mes projets <ArrowRight size={16} />
            </Link>
            <Link className="text-link" to="/a-propos">
              En savoir plus <ArrowDownRight size={15} />
            </Link>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={15} /> Un portrait sélectif, sans détails privés.
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Illustration abstraite de circuits numériques"
        >
          <div className="art-grid" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="art-core">
            <Code2 size={42} strokeWidth={1.25} />
          </div>
          <span className="art-label label-top">BUILD / LEARN</span>
          <span className="art-label label-bottom">IDEAS → SYSTEMS</span>
          <span className="art-coordinate">
            LOCAL
            <br />/ PERSONAL
          </span>
        </div>
      </section>
      <section className="metrics-strip" aria-label="Statistiques du site">
        <div>
          <strong>{facts.length}</strong>
          <span>infos sélectionnées</span>
        </div>
        <div>
          <strong>{categories.length}</strong>
          <span>thèmes explorés</span>
        </div>
        <div>
          <strong>{projects.length}</strong>
          <span>projets présentés</span>
        </div>
        <div className="metrics-note">
          <span className="metric-bar" /> Basé sur le document source
          <br />
          et filtré pour la confidentialité.
        </div>
      </section>
      <section className="section-block">
        <SectionHeading
          eyebrow="TERRAINS D’EXPLORATION"
          title="Ce qui m’anime"
          linkTo="/passions"
          linkLabel="Toutes mes passions"
        />
        <div className="interest-grid">
          {categoryCards.map((category, index) => (
            <Link
              to={`/informations?category=${encodeURIComponent(category)}`}
              className="interest-card"
              key={category}
            >
              <span className="card-index">0{index + 1}</span>
              <span className="interest-icon">
                <IconForCategory category={category} />
              </span>
              <h3>{category}</h3>
              <span className="card-arrow">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="feature-project">
        <div className="feature-copy">
          <p className="eyebrow">
            À LA UNE <span className="eyebrow-line" />
          </p>
          <p className="feature-number">
            01 <span>/ PROJET</span>
          </p>
          <h2>F1 Race Replay</h2>
          <p>
            Un projet Python autour de la Formule 1, de FastF1 et des données de
            télémétrie.
          </p>
          <Link className="text-link" to="/projets">
            Voir les projets <ArrowRight size={15} />
          </Link>
        </div>
        <div className="feature-visual" aria-hidden="true">
          <div className="telemetry-grid" />
          <div className="telemetry-track">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="telemetry-readout">
            <span>FORMULA 1 / DATA</span>
            <span>FASTF1 · PYTHON</span>
          </div>
          <div className="telemetry-value">F1</div>
        </div>
      </section>
      <section className="section-block categories-section">
        <SectionHeading
          eyebrow="LE CARNET"
          title="À explorer"
          linkTo="/informations"
          linkLabel="Ouvrir l’explorateur"
        />
        <div className="category-row">
          {categories.slice(0, 6).map((category) => (
            <Link
              to={`/informations?category=${encodeURIComponent(category)}`}
              className="category-chip"
              key={category}
            >
              <IconForCategory category={category} size={16} /> {category}{" "}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  linkTo,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  linkTo: string;
  linkLabel: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <Link className="text-link" to={linkTo}>
        {linkLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function AboutPage() {
  const known = getFacts([1, 12, 29, 30, 491, 493, 494, 495]);
  const preferences = getFacts([14, 17, 19, 26, 28, 498, 499]);
  return (
    <div className="page interior-page">
      <PageIntro
        eyebrow="QUI SUIS-JE ?"
        title="À propos"
        description="Un portrait construit à partir des faits partagés — sans remplir les zones d’ombre."
      />
      <div className="about-lead panel">
        <span className="about-mark">T.</span>
        <div>
          <p className="eyebrow">EN QUELQUES MOTS</p>
          <h2>Apprendre en faisant.</h2>
          <p>
            J’aime l’informatique. Je crée des projets, je découvre l’IA locale
            et j’administre mon serveur. J’apprends en pratiquant et je
            personnalise mes outils.
          </p>
        </div>
      </div>
      <div className="two-column">
        <FactPanel
          title="Repères confirmés"
          eyebrow="CE QUI EST DOCUMENTÉ"
          facts={known}
        />
        <FactPanel
          title="Ma façon d’avancer"
          eyebrow="PRÉFÉRENCES & OBJECTIFS"
          facts={preferences}
        />
      </div>
      <PrivacyNote />
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="page interior-page">
      <PageIntro
        eyebrow="EN COURS D’EXPLORATION"
        title="Mes projets"
        description="Quelques chantiers techniques qui reflètent les sujets explorés. Les détails affichés proviennent des informations disponibles."
      />
      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <div className="project-index">0{index + 1}</div>
            <div className="project-main">
              <p className="eyebrow">{project.category}</p>
              <h2>{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <details className="project-details">
                <summary>
                  Informations de la source <ChevronDown size={15} />
                </summary>
                <ul>
                  {getFacts(project.factIds).map((fact) => (
                    <li key={fact.id}>{fact.text}</li>
                  ))}
                </ul>
              </details>
            </div>
            <div className="project-aside">
              <span className="project-icon">
                <IconForCategory category={project.category} />
              </span>
              <Link
                to={`/informations?q=${encodeURIComponent(project.title === "F1 Race Replay" ? "Python" : project.title)}`}
                aria-label={`Explorer les informations sur ${project.title}`}
              >
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const setupGroups = [
  {
    title: "Unité centrale",
    icon: <Cpu />,
    ids: [72, 76, 77, 78, 79, 80, 83],
    note: "Configuration communiquée ; elle peut avoir évolué.",
  },
  {
    title: "Stockage",
    icon: <HardDrive />,
    ids: [143],
    note: "Les modèles précis, lettres de lecteurs et chemins locaux ne sont pas publiés.",
  },
  {
    title: "Écrans & accessoires",
    icon: <Monitor />,
    ids: [191, 192, 193, 194, 196],
    note: "Références partagées dans le document.",
  },
  {
    title: "Systèmes & environnements",
    icon: <Disc3 />,
    ids: [161, 162, 252, 257, 258, 281, 290, 291],
    note: "Versions et environnements mentionnés ; ce n’est pas un inventaire actuel.",
  },
  {
    title: "Serveur personnel",
    icon: <Server />,
    ids: [363, 373, 374, 398, 399, 400],
    note: "Les adresses, ports, domaines et chemins sont exclus.",
  },
];

function SetupPage() {
  return (
    <div className="page interior-page">
      <PageIntro
        eyebrow="MATÉRIEL & ENVIRONNEMENTS"
        title="Mon setup"
        description="Un aperçu technique prudent : certaines configurations sont historiques et ne sont pas garanties comme actuelles."
      />
      <div className="setup-grid">
        {setupGroups.map((group) => (
          <section className="setup-card panel" key={group.title}>
            <div className="setup-card-head">
              <span className="setup-icon">{group.icon}</span>
              <div>
                <p className="eyebrow">CONFIGURATION</p>
                <h2>{group.title}</h2>
              </div>
            </div>
            <ul className="setup-facts">
              {getFacts(group.ids).map((fact) => (
                <li key={fact.id}>{fact.text}</li>
              ))}
            </ul>
            <p className="setup-note">{group.note}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

const passionGroups = [
  {
    title: "Programmation",
    category: "Programmation",
    icon: <Code2 />,
    description:
      "Langages, outils et projets personnels pour apprendre en construisant.",
  },
  {
    title: "Intelligence artificielle locale",
    category: "IA locale",
    icon: <BrainCircuit />,
    description:
      "Modèles exécutés chez soi, assistants de code et usages qui réduisent la dépendance aux API payantes.",
  },
  {
    title: "Jeux vidéo",
    category: "Jeux vidéo",
    icon: <Gamepad2 />,
    description:
      "Rocket League, Fortnite et l’envie de comprendre les jeux autant que d’y jouer.",
  },
  {
    title: "Linux & systèmes",
    category: "Linux",
    icon: <Command />,
    description:
      "Découvrir Linux, coder et garder des environnements adaptés à chaque usage.",
  },
  {
    title: "Serveur personnel",
    category: "Serveur personnel",
    icon: <Server />,
    description:
      "Auto-hébergement et administration de services, avec une attention particulière à la maîtrise du système.",
  },
];

function PassionsPage() {
  return (
    <div className="page interior-page">
      <PageIntro
        eyebrow="SUJETS QUI REVIENNENT"
        title="Mes passions"
        description="Des centres d’intérêt techniques et ludiques, regroupés à partir des thèmes présents dans le document."
      />
      <div className="passion-list">
        {passionGroups.map((passion, index) => (
          <Link
            className="passion-card"
            to={`/informations?category=${encodeURIComponent(passion.category)}`}
            key={passion.title}
          >
            <span className="passion-index">0{index + 1}</span>
            <span className="passion-icon">{passion.icon}</span>
            <span className="passion-text">
              <span className="eyebrow">{passion.category.toUpperCase()}</span>
              <strong>{passion.title}</strong>
              <span>{passion.description}</span>
            </span>
            <ArrowUpRight className="passion-arrow" size={20} />
          </Link>
        ))}
      </div>
      <div className="quiet-note">
        <Sparkles size={17} />
        <p>
          Les préférences artistiques, musicales et d’autres goûts personnels ne
          sont pas détaillés ici lorsqu’ils ne sont pas établis par la source.
        </p>
      </div>
    </div>
  );
}

function GoalsPage() {
  const goals = [
    {
      title: "Développer et créer",
      category: "Programmation",
      ids: [300, 312, 316, 317, 320],
      icon: <Code2 />,
    },
    {
      title: "Explorer l’IA en local",
      category: "IA locale",
      ids: [331, 332, 333, 350, 351, 352],
      icon: <BrainCircuit />,
    },
    {
      title: "Apprendre Linux",
      category: "Linux",
      ids: [251, 257, 258, 276, 280],
      icon: <Command />,
    },
    {
      title: "Faire durer le matériel",
      category: "Jeux vidéo",
      ids: [236, 240, 244, 250],
      icon: <Cpu />,
    },
  ];
  return (
    <div className="page interior-page">
      <PageIntro
        eyebrow="CAPS EXPLICITES"
        title="Mes objectifs"
        description="Des envies et objectifs mentionnés explicitement. Aucun résultat ni niveau d’avancement n’est supposé."
      />
      <div className="goal-list">
        {goals.map((goal, index) => (
          <article className="goal-card panel" key={goal.title}>
            <span className="goal-index">0{index + 1}</span>
            <span className="goal-icon">{goal.icon}</span>
            <div>
              <p className="eyebrow">{goal.category.toUpperCase()}</p>
              <h2>{goal.title}</h2>
              <ul>
                {getFacts(goal.ids).map((fact) => (
                  <li key={fact.id}>{fact.text}</li>
                ))}
              </ul>
            </div>
            <Link
              className="goal-link"
              to={`/informations?category=${encodeURIComponent(goal.category)}`}
              aria-label={`Explorer ${goal.category}`}
            >
              <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function ExplorerPage() {
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get("category") ?? "Toutes";
  const initialQuery = params.get("q") ?? "";
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 24;
  const selectedId = Number(params.get("id"));
  const selectedFact =
    Number.isFinite(selectedId) && selectedId > 0
      ? getFact(selectedId)
      : undefined;

  useEffect(() => {
    setCategory(params.get("category") ?? "Toutes");
    setQuery(params.get("q") ?? "");
    setPage(1);
  }, [params]);

  const filteredFacts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return facts.filter(
      (fact) =>
        (category === "Toutes" || fact.category === category) &&
        (!normalized ||
          `${fact.text} ${fact.category}`
            .toLocaleLowerCase("fr")
            .includes(normalized)),
    );
  }, [category, query]);
  const pageCount = Math.max(1, Math.ceil(filteredFacts.length / pageSize));
  const visibleFacts = filteredFacts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function updateFilters(nextCategory: string, nextQuery: string) {
    const next = new URLSearchParams();
    if (nextCategory !== "Toutes") next.set("category", nextCategory);
    if (nextQuery.trim()) next.set("q", nextQuery.trim());
    setParams(next);
  }

  async function copyFact(fact: Fact) {
    try {
      await navigator.clipboard.writeText(fact.text);
      setCopiedId(fact.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch (error) {
      console.error("Impossible de copier cette information.", error);
    }
  }

  return (
    <div className="page interior-page explorer-page">
      <PageIntro
        eyebrow="LE CARNET PUBLIC"
        title="Toutes les informations"
        description="Recherche et parcours des informations retenues après filtrage de confidentialité. La sélection publique n’expose pas les 500 entrées brutes."
      />
      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span>
          Seule une sélection vérifiée est publiée. Les détails personnels, de
          santé, d’adresse et d’infrastructure sont exclus avant le build.
        </span>
      </div>
      {selectedFact ? (
        <article className="fact-detail panel">
          <button
            className="back-button"
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete("id");
              setParams(next);
            }}
          >
            <ArrowLeft size={15} /> Retour à la liste
          </button>
          <span className="tag">{selectedFact.category}</span>
          <span className="fact-id">
            #{String(selectedFact.id).padStart(3, "0")}
          </span>
          <h2>{selectedFact.text}</h2>
          <button
            className="button button-secondary"
            onClick={() => void copyFact(selectedFact)}
          >
            {copiedId === selectedFact.id ? (
              <Check size={15} />
            ) : (
              <Copy size={15} />
            )}
            {copiedId === selectedFact.id ? "Copié" : "Copier l’information"}
          </button>
        </article>
      ) : (
        <>
          <div className="explorer-controls">
            <label className="explorer-search">
              <Search size={18} />
              <span className="sr-only">
                Rechercher parmi les informations publiées
              </span>
              <input
                id="explorer-filter"
                value={query}
                onChange={(event) =>
                  updateFilters(category, event.target.value)
                }
                placeholder="Rechercher un sujet, un outil, un jeu…"
              />
              <kbd>⌘ K</kbd>
            </label>
            <label className="category-select-label">
              <span className="sr-only">Filtrer par catégorie</span>
              <select
                value={category}
                onChange={(event) => updateFilters(event.target.value, query)}
              >
                <option value="Toutes">Toutes les catégories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
          </div>
          <div className="results-summary">
            <strong>{filteredFacts.length}</strong> résultat
            {filteredFacts.length === 1 ? "" : "s"}
            <span>
              {category === "Toutes"
                ? "dans la sélection publique"
                : `dans ${category}`}
            </span>
          </div>
          {visibleFacts.length ? (
            <div className="facts-grid">
              {visibleFacts.map((fact) => (
                <article className="fact-card" key={fact.id}>
                  <div className="fact-meta">
                    <span>
                      <IconForCategory category={fact.category} size={14} />
                      {fact.category}
                    </span>
                    <span>#{String(fact.id).padStart(3, "0")}</span>
                  </div>
                  <Link
                    className="fact-text"
                    to={`/informations?${new URLSearchParams([...params, ["id", String(fact.id)]]).toString()}`}
                  >
                    {fact.text}
                  </Link>
                  <div className="fact-card-actions">
                    <Link
                      to={`/informations?${new URLSearchParams([...params, ["id", String(fact.id)]]).toString()}`}
                    >
                      Détail <ArrowUpRight size={13} />
                    </Link>
                    <button
                      onClick={() => void copyFact(fact)}
                      aria-label={`Copier l’information ${fact.id}`}
                    >
                      {copiedId === fact.id ? (
                        <Check size={15} />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={22} />
              <h2>Aucun résultat</h2>
              <p>Essaie un autre mot ou réinitialise le filtre.</p>
              <button
                className="text-link"
                onClick={() => updateFilters("Toutes", "")}
              >
                Effacer les filtres <ArrowRight size={14} />
              </button>
            </div>
          )}
          {pageCount > 1 && (
            <div className="pagination">
              <span>
                Page {page} sur {pageCount}
              </span>
              <div>
                <button
                  className="icon-button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Page précédente"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  className="icon-button"
                  disabled={page >= pageCount}
                  onClick={() => setPage(page + 1)}
                  aria-label="Page suivante"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          <div className="explorer-footer">
            <ShieldCheck size={15} /> La liste publique représente{" "}
            {facts.length} entrées sélectionnées sur 500. Les autres restent
            uniquement dans le fichier source local.
          </div>
        </>
      )}
    </div>
  );
}

function FactPanel({
  title,
  eyebrow,
  facts: items,
}: {
  title: string;
  eyebrow: string;
  facts: Fact[];
}) {
  return (
    <section className="fact-panel panel">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <ul>
        {items.map((fact) => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </section>
  );
}

function PrivacyNote() {
  return (
    <div className="privacy-note">
      <ShieldCheck size={18} />
      <div>
        <strong>Un portrait volontairement incomplet.</strong>
        <p>
          Les informations absentes ou incertaines ne sont pas transformées en
          faits. Les détails privés sont filtrés avant d’être intégrés au site.
        </p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page not-found">
      <p className="eyebrow">ERREUR 404</p>
      <h1>Cette page n’existe pas.</h1>
      <p>Le lien est peut-être incomplet ou a changé.</p>
      <Link className="button button-primary" to="/">
        Retour à l’accueil <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default App;
