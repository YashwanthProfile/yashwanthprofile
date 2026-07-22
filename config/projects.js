/**
 * RESEARCH PROJECTS CONFIGURATION
 * 
 * Each project item in this array represents a research project tile card on your home page.
 * 
 * Project Schema Guide:
 * - slug: Unique identifier (e.g., 'flapping-wing-mav'), matches directory in /content/projects/<slug>/content.md
 * - title: Display name of the project
 * - status: 'Ongoing' or 'Past'
 * - year: Academic year of the project
 * - description: Card preview text shown on home feed
 * - tileMedia: Image thumbnail URL or local path
 * - tileVideo: Optional local or web MP4 video for auto-play on hover
 * - tileIsVideo: Set to true if utilizing hover auto-play videos
 * - tags: List of keyword badges (e.g. ['Optimal Control', 'Robotics'])
 * - detail: Additional section-by-section text, related publication link IDs, etc.
 */

export const projectsData = [
  {
    slug: "flapping-wing-mav",
    title: "Actuator System and Control of Flapping Wing MAVs",
    status: "Ongoing",
    year: "2025",
    meta: "AIAA SciTech 2025",
    description: "Designing a novel six-bar flapping mechanism that alters flapping amplitude and frequency asymmetrically to generate aerodynamic moments for directional maneuvering, without separate control surfaces.",
    tileMedia: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
    tileVideo: "https://assets.mixkit.co/videos/preview/mixkit-flying-camera-drone-with-glowing-lights-42281-large.mp4",
    tileIsVideo: true,
    actions: [
      { title: "View Details", href: "#project/flapping-wing-mav" },
      { title: "AIAA Paper", href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102" },
    ],
    tags: ["Optimal Control", "Nonlinear Dynamics", "Robotics", "Flight Dynamics"],
    detail: {
      summary: "This project introduces a new six-bar mechanical design for bio-inspired flapping flight that achieves pitch, roll, and yaw torque through kinematic modulations, verified using Vortex Particle Methods and wind-tunnel force sensor arrays.",
      mediaSrc: "https://assets.mixkit.co/videos/preview/mixkit-flying-camera-drone-with-glowing-lights-42281-large.mp4",
      mediaIsVideo: true,
      mediaAlt: "Flapping mechanism design simulation and testing",
      mediaLabel: "Unsteady flight kinematics and dynamic control of aero-robots.",
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
      links: [
        { title: "Read AIAA Article", href: "https://arc.aiaa.org/doi/10.2514/6.2025-0102" },
        { title: "Github Repository", "href": "https://github.com/yashwanthprofile/flapping-mechanism" },
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
    description: "Developing linear-lifting predictors of highly nonlinear, time-varying flight dynamics of quadrotors and flapping-wing vehicles under gusty conditions, enabling high-frequency Model Predictive Control.",
    tileMedia: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
    tileVideo: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-42283-large.mp4",
    tileIsVideo: true,
    actions: [
      { title: "View Details", href: "#project/koopman-control" },
    ],
    tags: ["Optimal Control", "Nonlinear Dynamics", "Data-driven Learning", "Robotics", "Koopman Operator Theory"],
    detail: {
      summary: "We apply the infinite-dimensional Koopman operator theory to linearize complex, nonlinear aero-robotic systems into finite-dimensional linear state spaces. This allows robust and ultra-fast linear controller implementations on low-power onboard microcontrollers.",
      mediaSrc: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-42283-large.mp4",
      mediaIsVideo: true,
      mediaAlt: "Koopman-based state projection and control",
      mediaLabel: "Nonlinear flight state trajectories lifted to linear Koopman space.",
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
      links: [
        { title: "Interactive Koopman Demo", "href": "https://github.com/yashwanthprofile/koopman-mpc-demo" },
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
    description: "Analyzing transitions from periodic flapping flight states to chaotic stall states using non-linear recurrence network analysis and phase space reconstructions from wind tunnel telemetry.",
    tileMedia: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    actions: [
      { title: "View Details", href: "#project/complex-aero-stability" },
    ],
    tags: ["Nonlinear Dynamics", "Flight Dynamics"],
    detail: {
      summary: "Applying phase space reconstruction and chaos theory to identify precursors to aerodynamic stall in unsteady aeroelastic wings, providing safety margins for bio-inspired flyers.",
      mediaSrc: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
      mediaAlt: "Chaotic phase portraits of wing stall",
      mediaLabel: "Phase-portrait reconstruction from experimental strain gage sensors.",
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
      relatedPublications: ["pub-3"],
    },
  },
];
