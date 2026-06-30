import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ unique: true })
    public accountId!: string;

    @Column()
    public subdomain!: string;

    @Column()
    public accessToken!: string;

    @Column()
    public refreshToken!: string;

    @CreateDateColumn()
    public createdAt!: Date;

    @UpdateDateColumn()
    public updatedAt!: Date;
}
