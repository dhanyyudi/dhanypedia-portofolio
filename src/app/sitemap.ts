import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for SEO
 * Automatically includes all public routes
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dhanypedia.com';
  
  // Static routes
  const routes = ['', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // TODO: Fetch dynamic project routes from database
  // Example:
  // const projects = await getProjects();
  // const projectRoutes = projects.map((project) => ({
  //   url: `${baseUrl}/projects/${project.id}`,
  //   lastModified: project.updated_at || new Date().toISOString(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  return [
    ...routes,
    // ...projectRoutes,
  ];
}
