const companyTimeZone = process.env.COMPANY_TIME_ZONE;

if (!companyTimeZone) {
  throw new Error("COMPANY_TIME_ZONE is missing from .env");
}

export const getCompanyToday = () =>
  new Date(new Date().toLocaleDateString("en-CA", { timeZone: companyTimeZone }));
