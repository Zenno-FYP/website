import api from "@/services/api";

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersActiveDesktopLastHour: number;
  newUsersLast7Days: number;
  openChatReports: number;
}

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  role: string;
  activity_sync_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const r = await api.get<AdminStats>("/admin/stats");
  return r.data;
}

export async function fetchAdminUsers(params: {
  page?: number;
  limit?: number;
  verified?: "all" | "true" | "false";
}): Promise<{
  items: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const r = await api.get("/admin/users", { params });
  return r.data;
}

export interface AdminChatReportListItem {
  id: string;
  status: string;
  reason: string;
  createdAt: string;
  reporter: { id: string; name: string; email: string } | null;
  conversation_id: string;
}

export async function fetchAdminChatReports(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  items: AdminChatReportListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 25,
  };
  if (params.status && params.status !== "all") {
    query.status = params.status;
  }
  const r = await api.get("/admin/chat-reports", { params: query });
  return r.data;
}

export interface AdminChatReportParticipant {
  id: string;
  name: string;
  email: string;
}

export interface AdminChatReportMessagePreview {
  id: string;
  body: string;
  created_at: string;
  sender: { id: string; name: string; email: string };
}

export interface AdminChatReportDetail {
  id: string;
  status: string;
  reason: string;
  admin_note: string;
  resolved_at: string | null;
  createdAt: string;
  reporter: { id: string; name: string; email: string } | null;
  conversation_id: string;
  participants: AdminChatReportParticipant[];
  messages_preview: AdminChatReportMessagePreview[];
  messages_preview_count: number;
}

export async function fetchAdminChatReportDetail(reportId: string): Promise<AdminChatReportDetail> {
  const r = await api.get<AdminChatReportDetail>(`/admin/chat-reports/${reportId}`);
  return r.data;
}

export async function patchAdminChatReport(
  reportId: string,
  body: { status: string; admin_note?: string },
): Promise<void> {
  await api.patch(`/admin/chat-reports/${reportId}`, body);
}
