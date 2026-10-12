import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://tomeetcafe.id';

    // Halaman statis utama
    const routes = [
        '',
        '/menu',
        '/event',
        '/merchandise',
        '/roblox',
        '/birthday',
        '/career',
        '/visit-us',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return routes;
}