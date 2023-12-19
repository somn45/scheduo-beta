import AccountInput from '@/components/common/Input/AccountInput';
import AccountSubmit from '@/components/common/Input/AccountSubmit';
import AccountLabel from '@/components/common/label/AccountLabel';
import { signOut, useAppDispatch } from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { DELETE_USER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DeleteUserForm() {
  const [password, setPassword] = useState('');
  const [deleteUser] = useMutation(DELETE_USER);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteUser = async (e: inputClickEvent) => {
    e.preventDefault();
    const {
      query: { id },
    } = router;
    if (typeof id === 'string') {
      const { errors } = await deleteUser({
        variables: {
          _id: id,
          password,
        },
      });
      if (!errors) {
        dispatch(signOut());
        window.alert('계정이 정상적으로 삭제되었습니다. 홈으로 돌아갑니다.');
        router.push('/');
      }
    }
  };

  return (
    <section>
      <article>
        <h2>삭제 전 본인 확인</h2>
        <form>
          <AccountLabel caption="비밀번호" />
          <AccountInput
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMsg=""
          />

          <AccountSubmit
            value="최종 삭제 확인"
            onClick={handleDeleteUser}
            isDisabledSubmit={password.length >= 6 ? false : true}
          />
        </form>
      </article>
    </section>
  );
}
