export const PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 20, 50];

export const getPagination = (searchParams: URLSearchParams) => {
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = PAGE_SIZES.includes(Number(searchParams.get("limit"))) ? Number(searchParams.get("limit")) : PAGE_SIZE;
  return { skip: (page - 1) * limit, take: limit };
};
