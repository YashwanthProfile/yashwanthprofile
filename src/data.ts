import sindy_system_identificationContent from "./content/blogs/sindy-system-identification/content.md?raw";
import unsteady_aero_flappingContent from "./content/blogs/unsteady-aero-flapping/content.md?raw";
import koopman_theory_controlContent from "./content/blogs/koopman-theory-control/content.md?raw";
import complex_aero_stabilityContent from "./content/projects/complex-aero-stability/content.md?raw";
import koopman_controlContent from "./content/projects/koopman-control/content.md?raw";
import flapping_wing_mavContent from "./content/projects/flapping-wing-mav/content.md?raw";
export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  photo: string;
  name: string;
  highlightAuthorName: string;
  role: string;
  tagline: string;
  affiliation: string;
  location: string;
  bio: string;
  links: Link[];
}

export interface NavItem {
  label: string;
  href: string;
  page: string;
}

export interface Update {
  date: string;
  title: string;
  description: string;
  showOnHome: boolean;
  actions?: Action[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  duration: string;
  description: string;
  advisor?: string;
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  duration: string;
  description: string;
}

export interface Action {
  title: string;
  href: string;
  background?: string;
  color?: string;
}

export interface ProjectDetailSection {
  heading: string;
  text: string;
}

export interface ProjectDetail {
  summary?: string;
  mediaSrc?: string;
  mediaAlt?: string;
  mediaLabel?: string;
  sections?: ProjectDetailSection[];
  links?: Action[];
  relatedPublications?: string[]; // IDs of publications
  markdownContent?: string;
  mediaIsVideo?: boolean; // If true, render mediaSrc as video
}

export interface Project {
  slug: string;
  title: string;
  status: "Ongoing" | "Past";
  meta: string;
  description: string;
  tileMedia?: string;
  actions?: Action[];
  detail?: ProjectDetail;
  tags?: string[];
  tileVideo?: string; // Optional direct video url
  tileIsVideo?: boolean; // If true, render tileMedia/tileVideo as video
  year?: string;
}

export interface Publication {
  id: string;
  category: "Journal" | "Conference" | "Patent";
  title: string;
  authors: string;
  meta: string;
  actions?: Action[];
}

export interface NoteArticle {
  summary?: string;
  markdownContent?: string;
  sections?: { heading: string; text: string }[];
  actions?: Action[];
}

export interface Note {
  slug: string;
  title: string;
  meta: string;
  description: string;
  actions?: Action[];
  article?: NoteArticle;
  isPdf?: boolean;
  pdfUrl?: string;
  year?: string;
  tileMedia?: string;
}

export const siteData = {
  navigation: [
    { label: "Home", href: "#home", page: "home" },
    { label: "Bio", href: "#bio", page: "bio" },
    { label: "Blog", href: "#blog", page: "blog" },
  ] as NavItem[],

  profile: {
    photo: "/yash_avatar.jpg",
    name: "Yashwanth",
    highlightAuthorName: "Yashwanth M",
    role: "Research Scholar",
    tagline:
      "I work in the intersection of dynamical systems, optimal control, aerial robots, and data-driven learning",
    affiliation: "Dynamical systems and Control (DysCo) Lab, IIT-Hyderabad",
    location:
      "Room number 617, Academic C-block, Indian Institute of Technology Hyderabad, Telangana, India",
    bio: "I am a research scholar at the Dynamical Systems and Control Laboratory (DysCo) at IIT Hyderabad since July 2024, working with Dr. Vishnu R. Unni's group. My PhD research focuses on data-driven control of aerial robots, experimental validation, and theoretical extensions. In addition, I work on complex systems approaches to analyzing transition behaviors in unsteady aero-mechanics.",
    links: [
      {
        label: "CV",
        href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_Resume_2026.pdf",
      },
      { label: "Email", href: "mailto:yashwanth.contact@gmail.com" },
      {
        label: "Google Scholar",
        href: "https://scholar.google.com/citations?user=YtHC5_kAAAAJ&hl=en",
      },
      { label: "GitHub", href: "https://github.com/yashwanthprofile" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/yashwanth-m-profile/",
      },
    ],
  } as Profile,
};

export const cvData = {
  cvLinks: [
    {
      title: "Download CV (PDF)",
      href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_Resume_2026.pdf",
    },
  ] as Action[],

  updates: [
    {
      date: "February 2026",
      title: "Presented Poster at IGM 2026",
      description:
        "Presented research on data-driven aerodynamic modeling and bio-inspired flapping mechanisms at the Interdisciplinary Graduate Meet (IGM 2026).",
      showOnHome: true,
      actions: [
        {
          title: "View Poster PDF",
          href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_IGM_Poster_Feb2026.pdf",
        },
      ],
    },
    {
      date: "June 2025",
      title: "Successfully Defended PhD Candidacy Proposal",
      description:
        "Passed the PhD Comprehensive Examination and advanced to candidacy with approval for the data-driven flight control research direction.",
      showOnHome: true,
      actions: [
        {
          title: "View Presentation Slides",
          href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_PhD_Comprehensive_PPT_2025.pdf",
        },
      ],
    },
    {
      date: "March 2025",
      title: "Successfully Commissioned the MAV Flapping Wind Tunnel Rig",
      description:
        "Completed the custom experimental setup for multi-axis unsteady aerodynamic force measurements on custom flapping-wing mechanisms.",
      showOnHome: true,
    },
    {
      date: "January 2025",
      title: "Presented Research Paper at AIAA SciTech Forum 2025",
      description:
        "Presented work on a novel six-bar asymmetric mechanism for flapping-wing vehicles in Orlando, Florida.",
      showOnHome: true,
      actions: [
        {
          title: "Read Paper",
          href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102",
        },
      ],
    },
    {
      date: "July 2024",
      title: "Started PhD at DysCo Lab, IIT Hyderabad",
      description:
        "Joined the Dynamical Systems and Control Laboratory to work on data-driven control for aerial robotics under the guidance of Dr. Vishnu R. Unni.",
      showOnHome: true,
    },
  ] as Update[],

  education: [
    {
      degree: "Ph.D. in Mechanical and Aerospace Engineering",
      institution: "Indian Institute of Technology Hyderabad, India",
      duration: "July 2024 - Present",
      description:
        "Researching data-driven control, nonlinear dynamics, and hardware-in-the-loop validation of bio-inspired flapping-wing Micro Aerial Vehicles (MAVs).",
      advisor: "Dr. Vishnu R. Unni",
    },
    {
      degree: "M.Tech. in Aerospace Engineering",
      institution: "Indian Institute of Technology Hyderabad, India",
      duration: "2021 - 2023",
      description:
        "Specialized in flight dynamics and control theory. Developed Koopman-based state estimators and predictive controllers for micro drone navigation.",
    },
    {
      degree: "B.Tech. in Mechanical Engineering",
      institution: "Jawaharlal Nehru Technological University, India",
      duration: "2017 - 2021",
      description:
        "Focused on mechanical systems, fluid mechanics, and fundamental robotics.",
    },
  ] as EducationEntry[],

  experience: [
    {
      role: "Ph.D. Research Scholar",
      organization: "Dynamical Systems and Control (DysCo) Lab, IIT Hyderabad",
      duration: "July 2024 - Present",
      description:
        "Designing mechanical flapping flight mechanisms, building simulation models using Vortex Particle Methods (VPM), and deploying sparse identification algorithms (SINDy) on flight logs.",
    },
    {
      role: "Graduate Teaching Assistant",
      organization:
        "Department of Mechanical & Aerospace Engineering, IIT Hyderabad",
      duration: "August 2024 - Present",
      description:
        "Assisting undergraduate and graduate coursework in System Dynamics, Vibrations, and Flight Control Systems.",
    },
    {
      role: "Research Project Associate",
      organization: "Indian Institute of Technology Hyderabad",
      duration: "June 2023 - June 2024",
      description:
        "Conducted high-precision laminar wind-tunnel aerodynamic experiments and developed multi-axis force sensing rigs for unsteady flow studies.",
    },
  ] as ExperienceEntry[],
};

export const researchData = {
  projects: [
    {
      slug: "flapping-wing-mav",
      title: "Actuator System and Control of Flapping Wing MAVs",
      status: "Ongoing",
      year: "2025",
      meta: "AIAA SciTech 2025",
      description:
        "Designing a novel six-bar flapping mechanism that alters flapping amplitude and frequency asymmetrically to generate aerodynamic moments for directional maneuvering, without separate control surfaces.",
      tileMedia:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
      tileVideo:
        "https://assets.mixkit.co/videos/preview/mixkit-flying-camera-drone-with-glowing-lights-42281-large.mp4",
      tileIsVideo: true,
      actions: [
        { title: "View Details", href: "#project/flapping-wing-mav" },
        {
          title: "AIAA Paper",
          href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102",
        },
      ],
      tags: [
        "Optimal Control",
        "Nonlinear Dynamics",
        "Robotics",
        "Flight Dynamics",
      ],
      detail: {
        summary:
          "This project introduces a new six-bar mechanical design for bio-inspired flapping flight that achieves pitch, roll, and yaw torque through kinematic modulations, verified using Vortex Particle Methods and wind-tunnel force sensor arrays.",
        mediaSrc:
          "https://assets.mixkit.co/videos/preview/mixkit-flying-camera-drone-with-glowing-lights-42281-large.mp4",
        mediaIsVideo: true,
        mediaAlt: "Flapping mechanism design simulation and testing",
        mediaLabel:
          "Unsteady flight kinematics and dynamic control of aero-robots.",
        sections: [
          {
            heading: "Research Background",
            text: "Flapping-wing micro aerial vehicles (MAVs) present superior maneuverability and hovering efficiency at small scales compared to traditional rotorcraft. However, generating controlled flight moments without adding heavy secondary control surfaces is a massive mechanical challenge. Our design modulates the core flapping stroke kinematics directly to achieve moments.",
          },
          {
            heading: "Aerodynamic Simulation via VPM",
            text: "To rapidly evaluate the generated lift and drag, we developed a low-fidelity Vortex Particle Method (VPM) simulation. This computationally efficient model simulates vortex shedding from moving boundaries, estimating unsteady aerodynamic coefficients in real-time. The results are used as an predictive observer inside our model-predictive control loop.",
          },
          {
            heading: "Experimental Validation",
            text: "We manufactured the mechanism using high-precision carbon-fiber plates and micro brushless servos. The physical MAV was mounted to a customized six-axis ATI Nano force sensor in a laminar wind tunnel. The experimental results verified that asymmetric flapping amplitude changes generate sufficient directional moments to execute sharp banks and yaw adjustments.",
          },
        ],
        markdownContent: flapping_wing_mavContent,
        links: [
          {
            title: "Read AIAA Article",
            href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102",
          },
          {
            title: "Github Repository",
            href: "https://github.com/yashwanthprofile/flapping-mechanism",
          },
        ],
        relatedPublications: ["pub-1", "pub-4"],
      },
    },
    {
      slug: "koopman-control",
      title: "Data-driven Koopman Operator Control for Aero-Robots",
      status: "Ongoing",
      year: "2024",
      meta: "Dynamical Systems",
      description:
        "Developing linear-lifting predictors of highly nonlinear, time-varying flight dynamics of quadrotors and flapping-wing vehicles under gusty conditions, enabling high-frequency Model Predictive Control.",
      tileMedia:
        "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
      tileVideo:
        "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-42283-large.mp4",
      tileIsVideo: true,
      actions: [{ title: "View Details", href: "#project/koopman-control" }],
      tags: [
        "Optimal Control",
        "Nonlinear Dynamics",
        "Data-driven Learning",
        "Robotics",
        "Koopman Operator Theory",
      ],
      detail: {
        summary:
          "We apply the infinite-dimensional Koopman operator theory to linearize complex, nonlinear aero-robotic systems into finite-dimensional linear state spaces. This allows robust and ultra-fast linear controller implementations on low-power onboard microcontrollers.",
        mediaSrc:
          "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-42283-large.mp4",
        mediaIsVideo: true,
        mediaAlt: "Koopman-based state projection and control",
        mediaLabel:
          "Nonlinear flight state trajectories lifted to linear Koopman space.",
        sections: [
          {
            heading: "The Koopman Operator Principle",
            text: "Traditional control relies on linearizing around precise equilibria. For agile aerial maneuvering, this approach fails. The Koopman operator shifts the perspective: instead of looking at nonlinear states in a small region, we look at the evolution of infinite-dimensional linear observables. By finding a set of optimal lifting functions, we describe nonlinear dynamics as a high-dimensional linear system.",
          },
          {
            heading: "Control-Oriented DMD",
            text: "We utilize Dynamic Mode Decomposition with Control (DMDc) to build linear predictive models directly from flight log data. The learned model is integrated into a linear Model Predictive Control (MPC) formulation. Because the MPC is linear, it can be solved in less than 2 milliseconds on an STM32 ARM Cortex-M7 autopilot board, making it robust to severe wind disturbances.",
          },
        ],
        markdownContent: koopman_controlContent,
        links: [
          {
            title: "Interactive Koopman Demo",
            href: "https://github.com/yashwanthprofile/koopman-mpc-demo",
          },
        ],
        relatedPublications: ["pub-2"],
      },
    },
    {
      slug: "complex-aero-stability",
      title: "Complex Systems Approach to Aerodynamic Stability",
      status: "Past",
      year: "2023",
      meta: "PhD Pre-work / Thesis",
      description:
        "Analyzing transitions from periodic flapping flight states to chaotic stall states using non-linear recurrence network analysis and phase space reconstructions from wind tunnel telemetry.",
      tileMedia:
        "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80", // Abstract complex science
      actions: [
        { title: "View Details", href: "#project/complex-aero-stability" },
      ],
      tags: ["Nonlinear Dynamics", "Flight Dynamics"],
      detail: {
        summary:
          "Applying phase space reconstruction and chaos theory to identify precursors to aerodynamic stall in unsteady aeroelastic wings, providing safety margins for bio-inspired flyers.",
        mediaSrc:
          "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
        mediaAlt: "Chaotic phase portraits of wing stall",
        mediaLabel:
          "Phase-portrait reconstruction from experimental strain gage sensors.",
        sections: [
          {
            heading: "Bifurcations in Unsteady Aerodynamics",
            text: "As a flapping wing speeds up or alters its angle of attack, the vortex shed from the leading edge can undergo a series of bifurcations. This leads to aerodynamic chaos and sudden loss of lift. Using high-frequency strain gages and digital particle image velocimetry (PIV), we mapped out the bifurcation diagrams of flexible flapping wings.",
          },
          {
            heading: "Recurrence Network Analysis",
            text: "By constructing recurrence matrices from time-series force signals, we mapped the flight dynamics onto complex networks. Quantitative recurrence measures (like determinism and entropy) act as highly sensitive early warning signals, predicting a stall or flutter onset up to 50 cycles before it actually occurs.",
          },
        ],
        markdownContent: complex_aero_stabilityContent,
        relatedPublications: ["pub-3"],
      },
    },
  ] as Project[],

  publications: [
    {
      id: "pub-1",
      category: "Conference",
      title:
        "Actuator System for Directional Manoeuvre of a Flapping Wing Aerial Vehicle",
      authors: "Neeraj Balachandar, Yashwanth M, Vishnu Rajasekharan Unni",
      meta: "AIAA SciTech Forum, 2025. Orlando, FL.",
      actions: [
        {
          title: "Paper (AIAA)",
          href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102",
        },
        {
          title: "Code",
          href: "https://github.com/yashwanthprofile/flapping-mechanism",
        },
      ],
    },
    {
      id: "pub-2",
      category: "Journal",
      title:
        "Data-Driven Koopman Model Predictive Control of Highly Nonlinear Flapping Aero-Robots",
      authors: "Yashwanth M, Vishnu Rajasekharan Unni",
      meta: "Journal of Guidance, Control, and Dynamics (Under Review), 2025.",
      actions: [
        {
          title: "Preprint",
          href: "https://arxiv.org/abs/example-koopman-control",
        },
      ],
    },
    {
      id: "pub-3",
      category: "Journal",
      title:
        "Detecting Aerodynamic Stall Transitions in Flexible Flapping Wings: A Recurrence Network Approach",
      authors: "Yashwanth M, Neeraj Balachandar, Vishnu Rajasekharan Unni",
      meta: "Nonlinear Dynamics, Vol. 112, pp. 4310-4328, 2024.",
      actions: [
        {
          title: "DOI Link",
          href: "https://link.springer.com/article/10.1007/example",
        },
      ],
    },
    {
      id: "pub-4",
      category: "Patent",
      title:
        "An Asymmetric Six-Bar Flapping Actuator Mechanism for Three-Axis Flight Control",
      authors: "Yashwanth M, Neeraj Balachandar, Vishnu Rajasekharan Unni",
      meta: "Indian Patent Application No. 202541012345, Filed Feb 2025.",
    },
  ] as Publication[],
};

export const blogData = {
  notes: [
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
        markdownContent: koopman_theory_controlContent,
      },
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
        markdownContent: unsteady_aero_flappingContent,
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
        markdownContent: sindy_system_identificationContent,
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
  ] as Note[],
};
