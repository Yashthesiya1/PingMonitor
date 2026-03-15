export interface ServiceEntry {
  id: string;
  name: string;
  category: string;
  statusUrl: string;
  icon: string;
  description: string;
}

export const SERVICE_CATALOG: ServiceEntry[] = [
  // AI / LLM
  {
    id: "openai",
    name: "OpenAI",
    category: "AI / LLM",
    statusUrl: "https://status.openai.com/api/v2/status.json",
    icon: "🤖",
    description: "GPT-4, GPT-3.5, DALL-E, Whisper",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    category: "AI / LLM",
    statusUrl: "https://status.anthropic.com/api/v2/status.json",
    icon: "🧠",
    description: "Claude models",
  },
  {
    id: "google-ai",
    name: "Google AI Studio",
    category: "AI / LLM",
    statusUrl: "https://status.cloud.google.com/api/v1/incidents/active.json",
    icon: "✨",
    description: "Gemini models",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    category: "AI / LLM",
    statusUrl: "https://status.mistral.ai/api/v2/status.json",
    icon: "🌀",
    description: "Mistral, Mixtral models",
  },
  {
    id: "groq",
    name: "Groq",
    category: "AI / LLM",
    statusUrl: "https://status.groq.com/api/v2/status.json",
    icon: "⚡",
    description: "Fast LLM inference",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "AI / LLM",
    statusUrl: "https://status.huggingface.co/api/v2/status.json",
    icon: "🤗",
    description: "Models, Spaces, Inference API",
  },
  {
    id: "replicate",
    name: "Replicate",
    category: "AI / LLM",
    statusUrl: "https://status.replicate.com/api/v2/status.json",
    icon: "🔁",
    description: "Run ML models in the cloud",
  },
  {
    id: "cohere",
    name: "Cohere",
    category: "AI / LLM",
    statusUrl: "https://status.cohere.com/api/v2/status.json",
    icon: "💬",
    description: "Command, Embed, Rerank models",
  },

  // Cloud / Infrastructure
  {
    id: "github",
    name: "GitHub",
    category: "Cloud",
    statusUrl: "https://www.githubstatus.com/api/v2/status.json",
    icon: "🐙",
    description: "Code hosting, Actions, Packages",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Cloud",
    statusUrl: "https://www.vercel-status.com/api/v2/status.json",
    icon: "▲",
    description: "Frontend deployments, Edge",
  },
  {
    id: "netlify",
    name: "Netlify",
    category: "Cloud",
    statusUrl: "https://www.netlifystatus.com/api/v2/status.json",
    icon: "🌐",
    description: "Web hosting, Functions",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Cloud",
    statusUrl: "https://www.cloudflarestatus.com/api/v2/status.json",
    icon: "☁️",
    description: "CDN, DNS, Workers",
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    category: "Cloud",
    statusUrl: "https://status.digitalocean.com/api/v2/status.json",
    icon: "🌊",
    description: "Droplets, Kubernetes, Databases",
  },

  // Backend / Database
  {
    id: "supabase",
    name: "Supabase",
    category: "Backend",
    statusUrl: "https://status.supabase.com/api/v2/status.json",
    icon: "⚡",
    description: "Database, Auth, Storage, Edge Functions",
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Backend",
    statusUrl: "https://status.firebase.google.com/api/v1/incidents/active.json",
    icon: "🔥",
    description: "Realtime DB, Auth, Hosting",
  },
  {
    id: "mongodb",
    name: "MongoDB Atlas",
    category: "Backend",
    statusUrl: "https://status.cloud.mongodb.com/api/v2/status.json",
    icon: "🍃",
    description: "Cloud database",
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    category: "Backend",
    statusUrl: "https://www.planetscalestatus.com/api/v2/status.json",
    icon: "🪐",
    description: "Serverless MySQL",
  },

  // Communication
  {
    id: "twilio",
    name: "Twilio",
    category: "Communication",
    statusUrl: "https://status.twilio.com/api/v2/status.json",
    icon: "📱",
    description: "SMS, Voice, Video APIs",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    category: "Communication",
    statusUrl: "https://status.sendgrid.com/api/v2/status.json",
    icon: "📧",
    description: "Email delivery API",
  },

  // Payments
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    statusUrl: "https://status.stripe.com/api/v2/status.json",
    icon: "💳",
    description: "Payment processing",
  },
];

export const SERVICE_CATEGORIES = [
  ...new Set(SERVICE_CATALOG.map((s) => s.category)),
];
