import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  director: string;

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({ type: 'varchar', length: 255 })
  cover: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    //eager: true //load schedules together with film
    cascade: true, // schedules will be inserted/updated along with film
    onDelete: 'CASCADE', //delete schedules when film is deleted
    onUpdate: 'CASCADE', //update schedules when film is updated
  })
  schedules: ScheduleEntity[];
}
