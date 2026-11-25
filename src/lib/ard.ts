import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Agentic Resource Discovery (ARD): a manifest at /.well-known/ard.json that lets AI agents and
// registries discover what a domain offers. This site has no agents or tools, but it does publish
// a machine-readable profile, so that is what is listed. Spec: https://agenticresourcediscovery.org/spec/
//
// The type is "text/plain", not "text/markdown": the spec reserves text/markdown for Agent Skills
// (with a skills profile), and this is a profile of a person, not a skill.
//
// An entry must have an identifier, displayName, type (a media type) and exactly one of url or data.
// representativeQueries (2 to 5) are what a registry builds its search from.

export type ArdEntry = {
  identifier: string;
  displayName: string;
  type: string;
  url: string;
  description: string;
  tags: string[];
  version: string;
  updatedAt?: string;
  representativeQueries: string[];
};

export type ArdManifest = { entries: ArdEntry[] };

const TAGS = ["developer", "software engineer", "full-stack", "react native", "next.js", "node.js", "remote", "payments"];

const REPRESENTATIVE_QUERIES = [
  "find a full-stack developer open to remote work",
  "React Native developer who has shipped payments and real-time chat",
  "who can build a Next.js and Node.js app with secure Paystack payments",
  "software engineer in Nigeria for hire",
];

export function buildArdManifest(updatedAt?: Date): ArdManifest {
  const stamp = updatedAt?.toISOString();

  return {
    entries: [
      {
        identifier: "urn:air:delightsheriff.com:profile",
        displayName: `${SITE_NAME}: developer profile`,
        type: "text/plain",
        url: `${SITE_URL}/llms.txt`,
        description:
          "A short plain-text profile of Delight Amadi Sheriff, a full-stack and mobile software engineer open to remote roles worldwide: key facts, projects, experience, skills and contact.",
        tags: TAGS,
        version: "1",
        ...(stamp && { updatedAt: stamp }),
        representativeQueries: REPRESENTATIVE_QUERIES,
      },
      {
        identifier: "urn:air:delightsheriff.com:profile:full",
        displayName: `${SITE_NAME}: full developer profile`,
        type: "text/plain",
        url: `${SITE_URL}/llms-full.txt`,
        description:
          "The complete profile, with every achievement, project highlight and link, for assistants that want the detail.",
        tags: TAGS,
        version: "1",
        ...(stamp && { updatedAt: stamp }),
        representativeQueries: REPRESENTATIVE_QUERIES,
      },
    ],
  };
}
