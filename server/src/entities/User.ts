import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import AbstractEntity from "./Entity";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";

@Entity('users')
export default class User extends AbstractEntity {
    @Index()
    @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다.' })
    @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다.' })
    @Column({ unique: true })
    email: string;

    @Index()
    @Length(3, 23, { message: '사용자 이름은 3자 이상이어야 합니다' })
    @Column({ unique: true })
    username: string;

    @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다.' })
    @Column()
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    // insert 가 되기전에 먼저 실행해주는 데코레이터
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }
}