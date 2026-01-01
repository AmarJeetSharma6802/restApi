export const canSendEmail = (user) => {
  const now = Date.now();

  // 60 sec cooldown
  if (user.lastEmailSentAt && now - user.lastEmailSentAt < 60 * 1000) {
    return false;
  }

  // max 5 emails per hour
  if (user.emailSendCount >= 5) {
    return false;
  }

  return true;
};
