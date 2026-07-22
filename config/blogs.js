/**
 * BLOGS AND NOTE ENTRIES CONFIGURATION
 *
 * To write standard markdown articles:
 * - Create a directory under `/content/blogs/<slug>/content.md`
 * - Keep `"isPdf": false` and `"isExternal": false` (or omit them) and do not set `pdfUrl` or `url`.
 *
 * To link a high-fidelity handwritten iPad note / PDF:
 * - Set `"isPdf": true`
 * - Set `"pdfUrl"` pointing to your hosted PDF (e.g. on GitHub Pages or external storage)
 * - The website will automatically embed an elegant fullscreen PDF viewer right in the page!
 *
 * To link an external blog post (e.g., hosted on Medium, Substack, or Nexus of Thought):
 * - Set `"isExternal": true`
 * - Set `"url"` pointing to the external website (e.g. "https://blog.nexusofthought.workers.dev/your-post")
 * - Clicking the tile will open the article in a new tab automatically!
 */

export const blogsData = [
  {
    slug: "koopman-theory-control",
    title: "Koopman Operator Theory: Linearizing the Nonlinear World",
    meta: "May 2025 • Control Theory",
    year: "2025",
    description:
      "How can we control complex, chaotic aerial dynamics using standard linear controllers? A deep dive into the mathematics of infinite-dimensional Koopman operator projection.",
    tileMedia:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    article: {
      summary:
        "An intuitive explanation of how the Koopman operator shifts our perspective from state-spaces to observables, turning nonlinear control into a highly predictable linear problem.",
    },
  },
  {
    slug: "nexus-of-thought-collab",
    title: "Exploring Dynamical Transitions in Collective Robotics",
    meta: "Nexus of Thought • External Article",
    year: "2025",
    tileMedia:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    description:
      "An external article published on Nexus of Thought analyzing bifurcation transitions and flocking stability in distributed drone swarms.",
    isExternal: true,
    url: "https://blog.nexusofthought.workers.dev/",
  },
  {
    slug: "unsteady-aero-flapping",
    title: "Modeling the Unsteady Aerodynamics of Flapping Flight",
    meta: "March 2025 • Aerodynamics",
    year: "2025",
    tileMedia:
      "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80",
    description:
      "How birds and insects generate massive lift using Dynamic Stall and Leading Edge Vortices. Understanding unsteady aerodynamics via Vortex Particle Methods.",
    article: {
      summary:
        "A technical review of dynamic lift generation in biological flight and how computational low-fidelity methods compare to wind-tunnel measurements.",
    },
  },
  {
    slug: "sindy-system-identification",
    title: "Data-Driven Physics: System Identification using SINDy",
    meta: "November 2024 • Machine Learning",
    year: "2024",
    tileMedia:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    description:
      "How to extract clean ordinary differential equations directly from noisy flight telemetry logs using sparse regression.",
    article: {
      summary:
        "An introduction to the Sparse Identification of Nonlinear Dynamics (SINDy) algorithm, and how we use it to discover MAV equations of motion.",
    },
  },
  {
    slug: "motivation-to-svd",
    title: "Colloquium 8: Motivation to Singular Value Decomposition (SVD)",
    meta: "Handwritten Notes • Linear Algebra",
    year: "2025",
    tileMedia:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    description:
      "A high-fidelity handwritten note tracing the geometric and mathematical motivation behind Singular Value Decomposition (SVD), covering projection, eigenvalues, and matrix decomposition.",
    isPdf: true,
    pdfUrl:
      "https://yashwanthprofile.github.io/blog-data/Yashwanth_Colloquium-8_Motivation_to_SVD.pdf",
    actions: [
      {
        title: "Download PDF (SVD)",
        href: "https://yashwanthprofile.github.io/blog-data/Yashwanth_Colloquium-8_Motivation_to_SVD.pdf",
      },
    ],
  },
  {
    slug: "state-estimation-notes",
    title: "Handwritten iPad Notes: State Estimation & Observer Design",
    meta: "Handwritten Notes • State Estimation",
    year: "2025",
    tileMedia:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
    description:
      "Handwritten derivations, Kalman filtering equations, and nonlinear observer design proofs sketched out for dynamical flight systems under noise.",
    isPdf: true,
    pdfUrl:
      "https://yashwanthprofile.github.io/blog-data/Yashwanth_state_estimation_notes.pdf",
    actions: [
      {
        title: "Download PDF (State Estimation)",
        href: "https://yashwanthprofile.github.io/blog-data/Yashwanth_state_estimation_notes.pdf",
      },
    ],
  },
];
