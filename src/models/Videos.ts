export class Videos {
  constructor(
    private id: string,
    private titulo: string,
    private duracao: number,
    private dataUpload: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(newValue: string): void {
    this.id = newValue;
  }

  public getTitulo(): string {
    return this.titulo;
  }

  public setTitulo(newValue: string): void {
    this.titulo = newValue;
  }

  public getDuracao(): number {
    return this.duracao;
  }

  public setDuracao(newValue: number): void {
    this.duracao = newValue;
  }

  public getDataUpload(): string {
    return this.dataUpload;
  }

  public setDataUpload(newValue: string): void {
    this.dataUpload = newValue;
  }
}
