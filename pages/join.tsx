import AccountLinkButton from '@/components/common/button/AccountLinkButton';
import JoinForm from '@/components/join/join-form';
import { useRouter } from 'next/router';

export default function Join() {
  const router = useRouter();
  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-1/3 px-8 py-5 rounded-[5px] text-sm">
        <JoinForm />
        <AccountLinkButton
          value="기존 계정으로 로그인"
          onClick={() => router.push('/login')}
        />
      </div>
    </section>
  );
}
