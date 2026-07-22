/**
 * CV, EXPERIENCE, EDUCATION & TIMELINE UPDATES
 * 
 * Edit this file to update your educational background, employment history, 
 * and professional timeline/updates.
 * 
 * Safe from JSON parsing failures: trailing commas and comments are fully supported!
 */

export const cvDataStatic = {
  // Direct link to download your full CV PDF
  cvLinks: [
    {
      title: "Download CV (PDF)",
      href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_Resume_2026.pdf",
    },
  ],

  // Timeline Updates (shown on your Bio tab)
  updates: [
    {
      date: "February 2026",
      title: "Presented Poster at IGM 2026",
      description: "Presented research on data-driven aerodynamic modeling and bio-inspired flapping mechanisms at the Interdisciplinary Graduate Meet (IGM 2026).",
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
      description: "Passed the PhD Comprehensive Examination and advanced to candidacy with approval for the data-driven flight control research direction.",
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
      description: "Completed the custom experimental setup for multi-axis unsteady aerodynamic force measurements on custom flapping-wing mechanisms.",
      showOnHome: true,
    },
    {
      date: "January 2025",
      title: "Presented Research Paper at AIAA SciTech Forum 2025",
      description: "Presented work on a novel six-bar asymmetric mechanism for flapping-wing vehicles in Orlando, Florida.",
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
      description: "Joined the Dynamical Systems and Control Laboratory to work on data-driven control for aerial robotics under the guidance of Dr. Vishnu R. Unni.",
      showOnHome: true,
    },
  ],

  // Academic Degrees list
  education: [
    {
      degree: "Ph.D. in Mechanical and Aerospace Engineering",
      institution: "Indian Institute of Technology Hyderabad, India",
      duration: "July 2024 - Present",
      description: "Researching data-driven control, nonlinear dynamics, and hardware-in-the-loop validation of bio-inspired flapping-wing Micro Aerial Vehicles (MAVs).",
      advisor: "Dr. Vishnu R. Unni",
    },
    {
      degree: "M.Tech. in Aerospace Engineering",
      institution: "Indian Institute of Technology Hyderabad, India",
      duration: "2021 - 2023",
      description: "Specialized in flight dynamics and control theory. Developed Koopman-based state estimators and predictive controllers for micro drone navigation.",
    },
    {
      degree: "B.Tech. in Mechanical Engineering",
      institution: "Jawaharlal Nehru Technological University, India",
      duration: "2017 - 2021",
      description: "Focused on mechanical systems, fluid mechanics, and fundamental robotics.",
    },
  ],

  // Work Experience list
  experience: [
    {
      role: "Ph.D. Research Scholar",
      organization: "Dynamical Systems and Control (DysCo) Lab, IIT Hyderabad",
      duration: "July 2024 - Present",
      description: "Designing mechanical flapping flight mechanisms, building simulation models using Vortex Particle Methods (VPM), and deploying sparse identification algorithms (SINDy) on flight logs.",
    },
    {
      role: "Graduate Teaching Assistant",
      organization: "Department of Mechanical & Aerospace Engineering, IIT Hyderabad",
      duration: "August 2024 - Present",
      description: "Assisting undergraduate and graduate coursework in System Dynamics, Vibrations, and Flight Control Systems.",
    },
    {
      role: "Research Project Associate",
      organization: "Indian Institute of Technology Hyderabad",
      duration: "June 2023 - June 2024",
      description: "Conducted high-precision laminar wind-tunnel aerodynamic experiments and developed multi-axis force sensing rigs for unsteady flow studies.",
    },
  ],
};
