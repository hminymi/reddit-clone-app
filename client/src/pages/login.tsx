import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';

const login = () => {
    let router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const { authenticated } = useAuthState();
    const dispatch = useAuthDispatch();

    // 이미 로그인 된 사용자일 경우 메인 페이지로 리턴
    if (authenticated) router.push('/');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const res = await axios.post('/auth/login', { password, userName });

            // 로그인 한 유저 정보를 context에 저장
            dispatch('LOGIN', res.data?.user);

            router.push('/');
        } catch (error: any) {
            console.log(error);
            setErrors(error.response?.data || {})
        }
    }

    return (
        <div className='bg-white'>
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            placeholder='Username'
                            value={userName}
                            setValue={setUserName}
                            error={errors.error || errors.userName}
                        />
                        <InputGroup
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.error || errors.password}
                        />
                        <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                            로그인
                        </button>
                    </form>
                    <small className='text-black'>
                        아직 아이디가 없나요?
                        <Link href='/register' className='ml-1 text-blue-500 uppercase'>
                            회원가입
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default login