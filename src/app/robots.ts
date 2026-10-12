import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/'], // Sembunyikan endpoint internal dari index
        },
        sitemap: 'https://tomeetcafe.id/sitemap.xml',
    };
}