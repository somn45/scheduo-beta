import AccountInput from '@/components/common/Input/AccountInput';
import AccountSubmit from '@/components/common/Input/AccountSubmit';
import AccountLabel from '@/components/common/label/AccountLabel';
import { inputClickEvent } from '@/types/HTMLEvents';
import { CHECK_CURRENT_PASSWORD } from '@/utils/graphQL/querys/userQuerys';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function verificationPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [checkCurrentPassword] = useLazyQuery(CHECK_CURRENT_PASSWORD, {
    errorPolicy: 'all',
  });
  const router = useRouter();

  const handleCheckCurrentPassword = async (e: inputClickEvent) => {
    e.preventDefault();
    const {
      query: { id },
    } = router;
    if (typeof id === 'string') {
      const { error } = await checkCurrentPassword({
        variables: {
          _id: id,
          password: currentPassword,
        },
      });
      if (!error) router.push(`/users/${id}/edit/password/last`);
    }
  };

  return (
    <section className="mt-10 flex flex-col items-center">
      <h1 className="mb-4 text-lg font-semibold text-center">비밀번호 변경</h1>
      <form className="w-full flex flex-col items-center">
        <AccountLabel caption="기존 비밀번호" />
        <AccountInput
          name="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          errorMsg=""
        />

        <AccountSubmit
          value="비밀번호 확인"
          onClick={handleCheckCurrentPassword}
          isDisabledSubmit={false}
        />
      </form>
    </section>
  );
}
