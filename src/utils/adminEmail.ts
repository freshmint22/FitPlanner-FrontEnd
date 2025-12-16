export type AdminEmailParse = {
  cleanEmail: string;
  isAdmin: boolean;
};

// Admins type emails like: user(.gym)@gmail.com
// We detect the literal marker "(.gym)" anywhere in the local-part,
// strip it out, and mark the user as ADMIN.
export function parseAdminEmail(input: string): AdminEmailParse {
  const raw = (input || '').trim();
  const lower = raw.toLowerCase();
  const at = lower.indexOf('@');
  if (at <= 0) {
    // not an email-ish shape; still try to remove marker just in case
    const cleaned = raw.replace(/\(\.gym\)/gi, '');
    return { cleanEmail: cleaned, isAdmin: cleaned !== raw };
  }
  const local = raw.slice(0, at);
  const domain = raw.slice(at); // includes @
  const hasMarker = /\(\.gym\)/i.test(local);
  const cleanedLocal = local.replace(/\(\.gym\)/gi, '');
  return { cleanEmail: `${cleanedLocal}${domain}`, isAdmin: hasMarker };
}

export function roleFromInputEmail(input: string): 'ADMIN' | 'USER' {
  return parseAdminEmail(input).isAdmin ? 'ADMIN' : 'USER';
}
