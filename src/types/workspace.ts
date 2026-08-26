export type WorkspaceSummary = {
  id: string;
  slug: string;
  name: string;
  plan: "free" | "pro";
};

export type UserSummary = {
  name: string;
  email: string;
  initials: string;
};
