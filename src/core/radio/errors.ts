export class RadioModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RadioModelError';
  }
}
