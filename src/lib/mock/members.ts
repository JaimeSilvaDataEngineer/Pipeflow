export type MockMember = {
  id: string;
  name: string;
  initials: string;
  role: "admin" | "member";
};

export const MOCK_MEMBERS: MockMember[] = [
  { id: "mem_1", name: "Marina Costa", initials: "MC", role: "admin" },
  { id: "mem_2", name: "Rafael Souza", initials: "RS", role: "member" },
  { id: "mem_3", name: "Beatriz Lima", initials: "BL", role: "member" },
];

export function getMemberById(id: string): MockMember | undefined {
  return MOCK_MEMBERS.find((member) => member.id === id);
}
