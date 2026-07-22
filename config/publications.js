/**
 * PUBLICATIONS LIST CONFIGURATION
 * 
 * Grouped under 'Journal', 'Conference', and 'Patent' categories.
 * The website automatically groups, indexes, and renders them on your main home feed.
 */

export const publicationsData = [
  {
    id: "pub-1",
    category: "Conference",
    title: "Actuator System for Directional Manoeuvre of a Flapping Wing Aerial Vehicle",
    authors: "Neeraj Balachandar, Yashwanth M, Vishnu Rajasekharan Unni",
    meta: "AIAA SciTech Forum, 2025. Orlando, FL.",
    actions: [
      { "title": "Paper (AIAA)", "href": "https://arc.aiaa.org/doi/10.2514/6.2025-0102" },
      { "title": "Code", "href": "https://github.com/yashwanthprofile/flapping-mechanism" },
    ],
  },
  {
    id: "pub-2",
    category: "Journal",
    title: "Data-Driven Koopman Model Predictive Control of Highly Nonlinear Flapping Aero-Robots",
    authors: "Yashwanth M, Vishnu Rajasekharan Unni",
    meta: "Journal of Guidance, Control, and Dynamics (Under Review), 2025.",
    actions: [
      { "title": "Preprint", "href": "https://arxiv.org/abs/example-koopman-control" },
    ],
  },
  {
    id: "pub-3",
    category: "Journal",
    title: "Detecting Aerodynamic Stall Transitions in Flexible Flapping Wings: A Recurrence Network Approach",
    authors: "Yashwanth M, Neeraj Balachandar, Vishnu Rajasekharan Unni",
    meta: "Nonlinear Dynamics, Vol. 112, pp. 4310-4328, 2024.",
    actions: [
      { "title": "DOI Link", "href": "https://link.springer.com/article/10.1007/example" },
    ],
  },
  {
    id: "pub-4",
    category: "Patent",
    title: "An Asymmetric Six-Bar Flapping Actuator Mechanism for Three-Axis Flight Control",
    authors: "Yashwanth M, Neeraj Balachandar, Vishnu Rajasekharan Unni",
    meta: "Indian Patent Application No. 202541012345, Filed Feb 2025.",
  },
];
