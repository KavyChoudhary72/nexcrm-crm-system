export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  // Allow basic phone structures, at least 7 digits
  return mobile.trim().length >= 7;
};
