// Previously this file contained logic to detect a "(.gym)" marker
// in the local-part to auto-assign ADMIN role. That behavior was
// removed in favor of explicit role selection at registration/login.

export type AdminEmailParse = {
  cleanEmail: string;
  isAdmin: boolean;
};

export function parseAdminEmail(input: string): AdminEmailParse {
  const clean = (input || '').trim();
  return { cleanEmail: clean, isAdmin: false };
}

export function roleFromInputEmail(_input: string): 'ADMIN' | 'USER' {
  return 'USER';
}
