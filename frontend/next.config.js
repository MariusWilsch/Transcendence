
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.intra.42.fr', 'm.gettywallpapers.com', 'localhost'],
      },
      fallback: {
        path: 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg',
      },
  }
  
  module.exports = nextConfig
  