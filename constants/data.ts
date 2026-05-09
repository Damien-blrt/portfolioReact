/**
 * Portfolio Data - All content from the original HTML portfolio
 */

export const personalInfo = {
  name: 'Damien Ballerat',
  title: 'Étudiant en BUT Informatique',
  email: 'damien.ballerat@etu.uca.fr',
  location: 'Clermont-Ferrand, France',
};

export const aboutCards = [
  {
    icon: '👤',
    title: 'Qui suis-je ?',
    paragraphs: [
      "Je m'appelle Damien Ballerat et je suis actuellement étudiant en 2ème année au BUT informatique de Clermont-Ferrand.",
      "Grâce à cette formation, j'ai acquis la capacité de concevoir des programmes informatiques dans différents langages de programmation.",
      "J'ai participé à la Coupe de France de basketball UNSS Excellence avec l'équipe du lycée en terminale, où j'ai pu jouer contre certaines des meilleures équipes du pays.",
      "Je m'intéresse également aux jeux vidéo de tous genres.",
    ],
  },
  {
    icon: '⭐',
    title: 'Mes qualités',
    paragraphs: [
      "La minutie guide chaque ligne de code que j'écris, tandis que ma patience me permet de résoudre méthodiquement les défis techniques les plus complexes.",
      "Mon ambition me pousse constamment à élargir mes compétences, notamment en programmation dans le cadre personnel et professionnel.",
      "Mon sens aigu du travail se reflète dans mon investissement tant dans mes projets informatiques que dans ma pratique intensive du basketball.",
    ],
  },
  {
    icon: '🎯',
    title: 'Ce que je recherche',
    paragraphs: [
      "Je suis à la recherche d'une alternance pour l'année 2026/2027 dans le domaine de la programmation, où je pourrai mettre à profit mes compétences techniques et mes qualités personnelles.",
      "Je suis particulièrement intéressé par les projets qui me permettront de développer mes compétences en développement logiciel, web et mobile.",
      "Je suis également ouvert à d'autres technologies et langages de programmation, car je crois fermement que la diversité des expériences enrichit mes compétences.",
    ],
  },
];

export const qualities = {
  title: 'Patience & Ambition',
  intro:
    "Je suis une personne patiente et ambitieuse. Ma patience se manifeste par ma capacité à m'investir dans des tâches longues et répétitives, tandis que mon ambition m'incite à me fixer des objectifs élevés pour repousser mes limites.",
  achievement: {
    title: 'Un exemple marquant',
    text: "Malgré des résultats moyens en classe de 1ère, je me suis fixé l'objectif d'obtenir la mention \"Très bien\" au baccalauréat. Bien que je n'aie pas atteint cet objectif, j'ai obtenu mon diplôme avec une mention \"Bien\", avec des notes de 16 et 20 dans mes spécialités.",
  },
};

export const skillCategories = [
  {
    title: 'Programmation',
    skills: ['C', 'C++', 'Python', 'C# (.NET, XAML, MAUI, Entity Framework)', 'Java', 'JavaFX', 'Shell Unix'],
  },
  {
    title: 'Web',
    skills: ['HTML', 'CSS', 'PHP', 'Blazor', "Création d'API RESTful"],
  },
  {
    title: 'Base de données',
    skills: ['PostgreSQL', 'PL/pgSQL', 'MongoDB'],
  },
  {
    title: 'Développement mobile',
    skills: ['Kotlin', 'React Native'],
  },
  {
    title: 'Outils et technologies',
    skills: ['Git (utilisation fréquente)', 'Docker (déploiement)', 'Tests xUnit / jUnit', 'Administration réseau (initié)'],
  },
  {
    title: 'Architecture et conception',
    skills: ['Connaissance des 23 patrons de conception'],
  },
];

export const languageSkills = {
  title: 'Compétences linguistiques',
  description:
    "Anglais (niveau 90 %) : Maîtrise avancée à l'écrit et à l'oral, renforcée par mes voyages à l'étranger et des situations nécessitant une communication en anglais. Je suis capable de suivre des films en version originale et de participer à des conversations téléphoniques en anglais.",
};

export const parcours = {
  title: 'Parcours scolaire',
  entries: [
    {
      institution: 'Stage de fin d\'année - Phenikaa (Hanoï, Vietnam)',
      period: 'Avril 2026 - Juin 2026',
      description: 'Stage de recherche en intelligence artificielle au sein de l’IDSAI Lab : amélioration d’un modèle de segmentation d’images satellites pour la détection de zones inondées à l’aide de techniques de deep learning (U-Net, Sentinel-1/Sentinel-2).',
      image: 'vietnam',
    },
    {
      institution: 'BUT Informatique - Clermont-Ferrand',
      period: '2024 - Présent',
      description:
        "Actuellement étudiant en BUT Informatique à Clermont-Ferrand, j'ai choisi cette formation pour sa dimension professionnalisante et les nombreux débouchés qu'elle propose dans des secteurs en pleine évolution, comme le développement logiciel, la cybersécurité ou encore l'intelligence artificielle.",
      image: 'iut',
    },
    {
      institution: 'Lycée Godefroy-de-Bouillon',
      period: 'Baccalauréat général',
      description:
        "Baccalauréat général avec les spécialités physique-chimie et sciences économiques et sociales. Cette formation m'a permis d'acquérir des bases solides en sciences et en analyse, compétences que je continue de développer dans mon parcours actuel.",
      image: 'lycee',
    },
  ],
  futureGoal:
    "Mon projet professionnel est de poursuivre mes études en intégrant une école d'ingénieurs afin de me spécialiser dans l'un de ces domaines, plus particulièrement l'intelligence artificielle ou la cybersécurité.",
};

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  techStack: string[];
  githubUrl?: string;
  context: string;
  objective: string;
  architecture?: {
    items: { title: string; description: string }[];
    benefit?: string;
  };
  workItems: { title: string; items: string[] }[];
  results: {
    skills: string;
    learnings: string;
  };
}

export const projects: Project[] = [
  {
    id: 'jardinageons',
    title: 'Jardinageons',
    subtitle: 'Gestion de potager',
    techStack: ['PostgreSQL', 'PHP', 'Twig', 'JavaScript', 'Kotlin', 'C#', 'Entity Framework', 'Blazor', 'Docker', 'xUnit'],
    context:
      "Jardinageons est un projet de gestion de potager conçu pour aider les particuliers à organiser, suivre et optimiser leurs activités de jardinage. Le produit centralise l'ensemble des données liées au jardin — plantations, arrosage, stocks, récoltes et historique — afin de remplacer les supports papier et les outils fragmentés par une solution unique et cohérente.",
    objective:
      "Développer une application de gestion de potager permettant de planifier, organiser et suivre l'ensemble des activités de jardinage via une interface claire et structurée. Le projet vise à offrir une solution complète et moderne pour remplacer les méthodes traditionnelles de suivi de jardinage.",
    architecture: {
      items: [
        {
          title: 'Clean Architecture',
          description: "Architecture inspirée de la Clean Architecture, avec une séparation claire entre le domaine métier, la couche applicative et la persistance.",
        },
        {
          title: 'Repository & Unit of Work',
          description: "Accès aux données structuré autour des patterns Repository et Unit of Work, garantissant cohérence transactionnelle et découplage.",
        },
        {
          title: 'Mappers',
          description: "Système de mappers assurant la transformation entre entités métier et DTOs exposés par l'API.",
        },
        {
          title: 'MVC',
          description: "Application web développée selon le modèle MVC, avec Twig pour le rendu des vues et Bootstrap pour le design responsive.",
        },
      ],
      benefit:
        "Cette approche permet une application maintenable, testable et évolutive, capable de supporter plusieurs clients et des fonctionnalités futures.",
    },
    workItems: [
      {
        title: 'Backend API',
        items: [
          "Développement d'une API RESTful en C# avec Entity Framework",
          'Implémentation de la Clean Architecture',
          'Patterns Repository et Unit of Work',
          'Système de mappers pour les DTOs',
          'Tests unitaires avec xUnit',
        ],
      },
      {
        title: 'Application Web',
        items: [
          'Modèle MVC en PHP',
          'Interface web en PHP avec Twig',
          'Framework Bootstrap pour le design responsive',
          'Alto Router pour le routage',
          "JavaScript pour l'interactivité avec le canva",
        ],
      },
      {
        title: 'Application Mobile',
        items: [
          "Développement d'une application Android en Kotlin",
          "Intégration avec l'API centrale",
          'Interface utilisateur intuitive',
        ],
      },
      {
        title: 'Base de données',
        items: [
          'Conception et implémentation en PostgreSQL',
          'Gestion des plantations, arrosage, stocks et récoltes',
          'Historique complet des activités',
        ],
      },
      {
        title: 'DevOps',
        items: [
          'Containerisation avec Docker',
          'Configuration des environnements de développement',
        ],
      },
    ],
    results: {
      skills:
        "Architecture logicielle avancée, développement d'API RESTful, Clean Architecture, patterns de conception (Repository, Unit of Work), développement multi-plateformes (web et mobile), gestion de bases de données PostgreSQL, tests unitaires, containerisation Docker, développement en C#, PHP, Kotlin, et Blazor.",
      learnings:
        "Ce projet m'a permis de maîtriser les concepts d'architecture logicielle moderne et de développer une solution complète multi-clients. J'ai appris à structurer un projet selon les principes de la Clean Architecture, à implémenter des patterns de conception robustes, et à gérer la complexité d'une application distribuée.",
    },
  },
  {
    id: 'artistbot',
    title: 'ArtistBot',
    subtitle: 'Automatisation de dessin',
    techStack: ['Python', 'PyAutoGUI', 'Tkinter', 'NumPy', 'GDAL'],
    githubUrl: 'https://github.com/Damien-blrt/Artistbot',
    context:
      "Dans le cadre de mes explorations personnelles en programmation, j'ai décidé de créer une application en Python qui automatise le dessin d'une image à l'aide d'une palette de couleurs sur une interface graphique. Ce projet m'a permis de mieux comprendre l'automatisation, le traitement d'image, ainsi que l'utilisation de bibliothèques Python comme pyautogui, tkinter, numpy ou encore gdal.",
    objective:
      "L'objectif de ce projet était de concevoir un outil capable de reproduire une image pixel par pixel sur une application de dessin, de manière totalement automatisée, à partir d'une simple palette de couleurs sélectionnée par l'utilisateur.",
    workItems: [
      {
        title: "Chargement de l'image",
        items: ["Lecture et traitement d'un fichier image pour extraire les couleurs des pixels."],
      },
      {
        title: 'Sélection des couleurs',
        items: ["Enregistrement des positions des couleurs dans la palette, sur l'interface de dessin."],
      },
      {
        title: 'Définition de la zone de dessin',
        items: ["L'utilisateur sélectionne les coins de la toile à l'aide de clics, ce qui permet de déduire les dimensions."],
      },
      {
        title: 'Automatisation du dessin',
        items: ["Pixel par pixel, l'image est reproduite avec précision grâce à des clics automatisés."],
      },
      {
        title: 'Interface utilisateur',
        items: ["Utilisation de Tkinter pour guider l'utilisateur durant les différentes étapes."],
      },
      {
        title: 'Optimisation',
        items: ["Réduction des changements de couleurs et accélération du processus via une gestion optimisée des délais."],
      },
    ],
    results: {
      skills:
        "Programmation Python, automatisation avec PyAutoGUI, gestion d'interfaces graphiques avec Tkinter, traitement d'image avec NumPy et GDAL.",
      learnings:
        "J'ai découvert les limites et possibilités de l'automatisation via les scripts, et j'ai dû relever des défis comme la reconnaissance de couleurs, la synchronisation précise des clics et l'optimisation des performances. Ce projet a été une excellente occasion de renforcer mes compétences en développement Python tout en travaillant sur un projet concret et amusant.",
    },
  },
  {
    id: 'pokerandom',
    title: 'Pokerandom',
    subtitle: 'Site web avec API',
    techStack: ['C#', 'API RESTful', 'PHP', 'JavaScript'],
    context:
      "Pokerandom est un site web connecté à une API que j'ai créée. Ce projet m'a permis de développer une application complète avec une séparation claire entre le frontend (site web en PHP) et le backend (API en C#), démontrant ma capacité à concevoir et implémenter une architecture client-serveur moderne.",
    objective:
      "Créer un site web fonctionnel connecté à une API personnalisée, permettant de démontrer mes compétences en développement full-stack, en architecture d'API RESTful et en intégration frontend-backend.",
    architecture: {
      items: [
        {
          title: 'API Backend (C#)',
          description: "Développement d'une API RESTful en C# pour gérer la logique métier et les données.",
        },
        {
          title: 'Site Web (PHP)',
          description: "Interface utilisateur développée en PHP, connectée à l'API pour afficher et interagir avec les données.",
        },
        {
          title: 'Communication',
          description: 'Communication entre le frontend et le backend via des requêtes HTTP/REST.',
        },
      ],
    },
    workItems: [
      {
        title: 'API RESTful en C#',
        items: [
          "Conception et développement de l'API",
          'Endpoints REST pour les différentes fonctionnalités',
          'Gestion des requêtes HTTP',
          'Structure modulaire et maintenable',
        ],
      },
      {
        title: 'Site Web en PHP',
        items: [
          "Développement de l'interface utilisateur",
          "Intégration avec l'API via requêtes HTTP",
          'Gestion des interactions utilisateur',
          'Interface responsive et intuitive',
        ],
      },
      {
        title: 'JavaScript',
        items: [
          'Interactivité côté client',
          'Gestion des appels API',
          "Amélioration de l'expérience utilisateur",
        ],
      },
      {
        title: 'Intégration',
        items: [
          'Communication frontend-backend',
          'Gestion des erreurs',
          'Validation des données',
        ],
      },
    ],
    results: {
      skills:
        "Développement d'API RESTful en C#, développement web en PHP, intégration frontend-backend, architecture client-serveur, gestion des requêtes HTTP, JavaScript pour l'interactivité.",
      learnings:
        "Ce projet m'a permis de comprendre en profondeur l'architecture d'une application web moderne avec séparation frontend/backend. J'ai appris à concevoir une API RESTful robuste, à gérer la communication entre différents composants, et à créer une interface utilisateur qui interagit efficacement avec une API.",
    },
  },
];
