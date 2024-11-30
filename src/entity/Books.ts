import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    uploadBy: number;

    @Column()
    genre: string;

    @Column()
    description: string;

    @Column()
    publishedDate: Date;

    @Column({ nullable: true })
    coverImage?: string;

    @Column()
    pdfPath: string;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
