<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Cloudinary Plugin
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Cloudinary file storage provider for Medusa v2
</p>

## Features

- 🖼️ Upload and manage files using Cloudinary
- 🔒 Secure file uploads with API authentication
- 📁 Organize files in custom folders
- ✅ Compatible with Medusa v2

## Compatibility

This plugin is compatible with versions >= 2.4.0 of `@medusajs/medusa`.

## Installation

```bash
npm install @ridoy-sarker/medusa-cloudinary
```

or

```bash
yarn add @ridoy-sarker/medusa-cloudinary
```

## Configuration

### 1. Get Cloudinary Credentials

Sign up for a [Cloudinary account](https://cloudinary.com/) and get your:
- Cloud Name
- API Key
- API Secret

### 2. Add Environment Variables

Add the following to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Configure Medusa

Add the plugin to your `medusa-config.ts` or `medusa-config.js`:

```typescript
module.exports = defineConfig({
  projectConfig: {
    // ... other config
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@ridoy-sarker/medusa-cloudinary/providers/cloudinary",
            id: "cloudinary",
            options: {
              apiKey: process.env.CLOUDINARY_API_KEY,
              apiSecret: process.env.CLOUDINARY_API_SECRET,
              cloudName: process.env.CLOUDINARY_CLOUD_NAME,
              folderName: "store", // Optional: Folder name in Cloudinary
              secure: true, // Optional: Use HTTPS (default: true)
            },
          },
        ],
      },
    },
  ],
});
```

## Usage

Once configured, the Cloudinary provider will be used automatically for file uploads in your Medusa application. You can upload files through:

- Admin dashboard (product images, etc.)
- API endpoints that handle file uploads
- Custom workflows that use the file module

### Example: Upload File Programmatically

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fileModuleService = req.scope.resolve("file");
  
  const uploadedFile = await fileModuleService.uploadFile({
    filename: "product-image.jpg",
    mimeType: "image/jpeg",
    content: fileBuffer, // Buffer or Stream
  });
  
  res.json({ file: uploadedFile });
}
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | string | Yes | - | Your Cloudinary API key |
| `apiSecret` | string | Yes | - | Your Cloudinary API secret |
| `cloudName` | string | Yes | - | Your Cloudinary cloud name |
| `folderName` | string | No | `"medusa"` | Folder name in Cloudinary for organizing files |
| `secure` | boolean | No | `true` | Use HTTPS for file URLs |

## Compatibility Matrix

This plugin is compatible with versions >= 2.4.0 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins) to learn more about plugins and how to create them.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
