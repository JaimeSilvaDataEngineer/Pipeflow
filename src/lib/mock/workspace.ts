export type MockWorkspace = {
  id: string;
  slug: string;
  name: string;
  plan: "free" | "pro";
};

export const MOCK_WORKSPACES: MockWorkspace[] = [
  { id: "ws_1", slug: "acme", name: "Acme Inc.", plan: "pro" },
  { id: "ws_2", slug: "nimbus-vendas", name: "Nimbus Vendas", plan: "free" },
];

export const DEFAULT_WORKSPACE = MOCK_WORKSPACES[0];

export function getWorkspaceBySlug(slug: string): MockWorkspace | undefined {
  return MOCK_WORKSPACES.find((workspace) => workspace.slug === slug);
}

export type MockUser = {
  name: string;
  email: string;
  initials: string;
  role: "admin" | "member";
};

export const MOCK_USER: MockUser = {
  name: "Marina Costa",
  email: "marina@acme.com",
  initials: "MC",
  role: "admin",
};
