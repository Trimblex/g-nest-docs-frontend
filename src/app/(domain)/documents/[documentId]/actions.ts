"use server";
import axios from "@/config/axiosConfig";
import { OrgMemberVO } from "@/interface/orgs";

export async function getUsers(organizationId: string, token: string) {
  const res = await axios.get(`/org/getMembers/${organizationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const users = res.data.map((member: OrgMemberVO) => ({
    id: member.userId,
    name: member.username ?? member.email ?? "匿名",
    avatar: member.avatarUrl,
  }));
  return users;
}
