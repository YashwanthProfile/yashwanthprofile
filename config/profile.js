/**
 * PROFILE CONFIGURATION
 * 
 * This file contains your personal info, navigation labels, bio, affiliation, and social links.
 * 
 * Feel free to use standard JavaScript comments and trailing commas!
 * Changes made here will reflect instantly on your portfolio without any build step.
 */

export const profileData = {
  // Navigation links shown in the top navigation bar
  navigation: [
    { label: "Home", href: "#home", page: "home" },
    { label: "Bio", href: "#bio", page: "bio" },
    { label: "Blog", href: "#blog", page: "blog" },
  ],

  // Your personal details
  profile: {
    photo: "yash_avatar.jpg", // Path to your profile picture (at the root or in public folder)
    name: "Yashwanth",
    highlightAuthorName: "Yashwanth M", // This name will be automatically bolded in publication author lists
    role: "Research Scholar",
    tagline: "I work in the intersection of dynamical systems, optimal control, aerial robots, and data-driven learning",
    affiliation: "Dynamical systems and Control (DysCo) Lab, IIT-Hyderabad",
    location: "Room number 617, Academic C-block, Indian Institute of Technology Hyderabad, Telangana, India",
    
    // Main bio paragraph
    bio: "I am a research scholar at the Dynamical Systems and Control Laboratory (DysCo) at IIT Hyderabad since July 2024, working with Dr. Vishnu R. Unni's group. My PhD research focuses on data-driven control of aerial robots, experimental validation, and theoretical extensions. In addition, I work on complex systems approaches to analyzing transition behaviors in unsteady aero-mechanics.",
    
    // Social and professional profiles (CV, Email, Scholar, GitHub, LinkedIn, etc.)
    links: [
      { label: "CV", href: "https://yashwanthprofile.github.io/cv-data/Yashwanth_Resume_2026.pdf" },
      { label: "Email", href: "mailto:yashwanth.contact@gmail.com" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=YtHC5_kAAAAJ&hl=en" },
      { label: "GitHub", href: "https://github.com/yashwanthprofile" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/yashwanth-m-profile/" },
    ],
  },
};
