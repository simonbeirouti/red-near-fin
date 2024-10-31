import { z } from 'zod';

const RouteMatchingEnd = z
  .union([z.boolean(), z.function().args(z.string()).returns(z.boolean())])
  .default(false)
  .optional();

const Divider = z.object({
  divider: z.literal(true),
});

const RouteChildren = z.array(
  z.object({
    label: z.string(),
    path: z.string(),
    Icon: z.custom<React.ReactNode>(),
    end: RouteMatchingEnd,
    children: z
      .array(
        z.object({
          label: z.string(),
          path: z.string(),
          Icon: z.custom<React.ReactNode>(),
          end: RouteMatchingEnd,
        }),
      )
      .default([])
      .optional(),
  }),
);

export const NavigationConfigSchema = z.object({
  style: z.enum(['custom', 'sidebar', 'header']).default('sidebar'),
  sidebarCollapsed: z
    .enum(['false', 'true'])
    .default('false')
    .optional()
    .transform((value) => value === `true`),
  routes: z.array(
    z.union([
      z.object({
        label: z.string(),
        collapsible: z.boolean().optional(),
        collapsed: z.boolean().optional(),
        children: RouteChildren,
        renderAction: z.custom<React.ReactNode>().optional(),
      }),
      Divider,
    ]),
  ),
});
