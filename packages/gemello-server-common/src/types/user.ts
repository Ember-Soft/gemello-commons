export type MemberRole = "ASSISTANT" | "BENEFICIARY" | "MANAGER";

interface MemberOfOrganizationInfo {
  orgId: number;
  roles: MemberRole[];
}

export interface GemelloUser {
  userId: string;
  userName: string;
}
