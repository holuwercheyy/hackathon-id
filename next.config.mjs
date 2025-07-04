/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Make sure environment variables are available at build time
    SMS_API_URL: process.env.SMS_API_URL,
    SMS_API_KEY: process.env.SMS_API_KEY,
    OZOW_API_KEY: process.env.OZOW_API_KEY,
    OZOW_SITE_CODE: process.env.OZOW_SITE_CODE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },
}

export default nextConfig
