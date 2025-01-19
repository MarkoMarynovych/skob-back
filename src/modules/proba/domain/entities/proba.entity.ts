export class ProbaEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly section: string,
    public readonly section_name: string,
    public readonly order: number,
    public readonly items: ProbaItemEntity[]
  ) {}
}

export class ProbaItemEntity {
  constructor(
    public readonly id: string,
    public readonly order: number,
    public readonly is_completed: boolean,
    public readonly completed_at?: Date,
    public readonly signed_by_id?: string
  ) {}
}
