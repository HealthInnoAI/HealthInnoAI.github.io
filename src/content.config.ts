import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

/* ──────────────────────────────────────────────────────────────
   LEARN collection  (was “post”)
   ────────────────────────────────────────────────────────────── */
const learn = defineCollection({
	loader: glob({ base: "./src/content/learn", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z.string().or(z.date()).transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			topic: z.string().optional(),
		}),
});

/* ──────────────────────────────────────────────────────────────
   NOTE collection  (unchanged)
   ────────────────────────────────────────────────────────────── */
const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true })
			.transform((val) => new Date(val)),
	}),
});

/* ──────────────────────────────────────────────────────────────
   Export collections
   ────────────────────────────────────────────────────────────── */
export const collections = {
	learn,   // new name
	post: learn, // alias for legacy code
	note,
};
