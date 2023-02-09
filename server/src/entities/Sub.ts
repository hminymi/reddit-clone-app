import { Expose } from "class-transformer";
import { Index, Column, ManyToOne, JoinColumn, OneToMany, Entity } from "typeorm";
import AbstractEntity from "./Entity";
import Post from "./Post";
import User from "./User";

@Entity('subs')
export default class Sub extends AbstractEntity {
    @Index()
    @Column({ unique: true })
    name: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrn: string;

    @Column({ nullable: true })
    bannerUrn: string;

    @Column()
    userName: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userName', referencedColumnName: 'userName' })
    user: User;

    @OneToMany(() => Post, (post) => post.sub)
    posts: Post[];

    @Expose()
    get imageUrl(): string {
        return this.imageUrn
            ? `${process.env.APP_URL}/images/${this.imageUrn}`
            : 'https://www.gravatar.com/avatar?d=mp&f=y';
    }

    @Expose()
    get bannerUrl(): string {
        return this.bannerUrn
            ? `${process.env.APP_URL}/images/${this.bannerUrn}`
            : undefined;
    }
}