import { Column, ManyToOne, JoinColumn, Entity } from "typeorm";
import AbstractEntity from "./Entity";
import Comment from './Comment';
import Post from "./Post";
import User from "./User";

@Entity('votes')
export default class Vote extends AbstractEntity {
    @Column()
    value: number;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @Column({ nullable: true })
    postId: number;

    @ManyToOne(() => Post)
    post: Post;

    @Column({ nullable: true })
    commentId: number;

    @ManyToOne(() => Comment)
    comment: Comment;
}