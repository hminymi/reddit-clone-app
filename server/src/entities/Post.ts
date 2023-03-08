import { Exclude, Expose } from "class-transformer";
import { Index, Column, ManyToOne, JoinColumn, OneToMany, Entity, BeforeInsert } from "typeorm";
import { makeId, slugify } from '../utils/helpers'
import AbstractEntity from "./Entity";
import Comment from "./Comment";
import Sub from "./Sub";
import User from "./User";
import Vote from "./Vote";

@Entity('posts')
export default class Post extends AbstractEntity {
    @Index()
    @Column({ unique: true })
    identifier: string;

    @Column()
    title: string;

    @Index()
    @Column()
    slug: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column()
    subName: string;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub;

    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];

    @Expose()
    get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`;
    }

    @Expose()
    get commentCount(): number {
        return this.comments?.length;
    }

    @Expose()
    get voteScore(): number {
        return this.votes?.reduce((previousVal, currentObj) => previousVal + (currentObj.value || 0), 0);
    }

    protected userVote: number;

    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
}