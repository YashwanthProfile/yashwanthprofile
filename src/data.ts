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
