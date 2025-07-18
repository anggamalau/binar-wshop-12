export class QueryParamsParser {
  public static parseUrl(request: Request): URLSearchParams {
    const url = new URL(request.url);
    return url.searchParams;
  }

  public static getDivisionFilter(searchParams: URLSearchParams): string | undefined {
    const division = searchParams.get("division");
    return division && division !== "all" ? division : undefined;
  }
}