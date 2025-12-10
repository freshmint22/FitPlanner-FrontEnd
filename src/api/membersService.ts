import axiosClient from './axiosClient';

export interface MemberDto {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  rol?: string;
  estado?: string;
  createdAt?: string;
}

export interface ListResponse {
  items: MemberDto[];
  total: number;
  page: number;
  limit: number;
}

export const listMembers = async (
  page = 1,
  limit = 10,
  q?: string
): Promise<ListResponse> => {
  const params: Record<string, unknown> = { page, limit };
  if (q) params.q = q;
  const { data } = await axiosClient.get<ListResponse>('/users', { params });
  return data;
};

export default { listMembers };
