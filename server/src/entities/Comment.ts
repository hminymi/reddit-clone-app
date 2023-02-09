import { Exclude, Expose } from "class-transformer";
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { makeId } from "../utils/helpers";
import AbstractEntity from "./Entity";
import Post from "./Post";
import User from "./User";
import Vote from "./Vote";

@Entity('comments')
export default class Comment extends AbstractEntity {
    @Index()
    @Column({ unique: true })
    identifier: string;
    
    @Column()
    body: string;

    @Column()
    userName: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'userName', referencedColumnName: 'userName' })

    @Column()
    postId: number;

    @ManyToOne(() => Post, (post) => post.comments, {nullable: false})
    post: Post;

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[];

    protected userVote: number;

    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.userName === user.userName);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @Expose()
    get voteScore(): number {
        return this.votes?.reduce((previousVal, currentObj) => previousVal + (currentObj.value || 0), 0);
    }

    @BeforeInsert()
    makeId() {
        this.identifier = makeId(8);
    }
}