import crypto from 'crypto';

export const generateTemporaryPassword = (length = 12): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';

  const all = upper + lower + digits + symbols;
  const chars: string[] = [];

  // Guarantee at least one character from each set
  chars.push(upper[crypto.randomInt(0, upper.length)]);
  chars.push(lower[crypto.randomInt(0, lower.length)]);
  chars.push(digits[crypto.randomInt(0, digits.length)]);
  chars.push(symbols[crypto.randomInt(0, symbols.length)]);

  for (let i = 4; i < length; i++) {
    chars.push(all[crypto.randomInt(0, all.length)]);
  }

  // Cryptographically shuffle the array
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
};
