export class ContentNotFoundError extends Error {
  constructor(entity: string, locale: string) {
    super(
      `${entity} content not found for locale "${locale}". Run "npm run db:seed" after configuring DATABASE_URL.`,
    );
    this.name = "ContentNotFoundError";
  }
}
