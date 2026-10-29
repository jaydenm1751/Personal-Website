export interface ProjectDetails {
  problem?: string;
  architecture?: string;
  challenges?: string;
  results?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  status: "Public" | "Private";
  featured?: boolean;
  repositoryUrl?: string;
  demoUrl?: string;
  details?: ProjectDetails;
}
