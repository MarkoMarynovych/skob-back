import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() update_at: Date

  constructor(entity: Partial<T>) {
    Object.assign(this, entity)
  }
}
