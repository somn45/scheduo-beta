import AccountLinkButton from '@/components/common/button/AccountLinkButton';
import LoginForm from '@/components/login/login-form';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  return (
    <section className="w-full h-full flex flex-col items-center">
      <article className="w-1/3 px-8 py-5 rounded-[5px] text-sm">
        <h2 className="mb-8 text-center text-3xl font-semibold">Scheduo</h2>
        <LoginForm />
        <AccountLinkButton
          value="Scheduo 회원가입하기"
          onClick={() => router.push('/join')}
        />
      </article>
    </section>
  );
}
