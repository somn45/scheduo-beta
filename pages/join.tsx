import AccountLinkButton from '@/components/common/button/AccountLinkButton';
import JoinForm from '@/components/join/join-form';
import { useRouter } from 'next/router';

export default function Join() {
  const router = useRouter();
  return (
    <section className="w-full h-full flex flex-col items-center">
      <article className="w-full lg:w-1/2 2xl:w-1/3 px-8 py-5 rounded-[5px] text-sm flex flex-col items-center">
        <h5 className="mb-4 text-center">*는 필수 문항입니다</h5>
        <JoinForm />
        <AccountLinkButton
          value="기존 계정으로 로그인"
          onClick={() => router.push('/login')}
        />
      </article>
    </section>
  );
}
