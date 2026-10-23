// Frontend dashboard component consuming /v1/users contract

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: {
    requestId: string;
    count?: number;
  };
}

export function renderUserRow(user: UserSummary): string {
  return `<tr data-user-id="${user.id}"><td>${user.displayName}</td><td>${user.email}</td></tr>`;
}
