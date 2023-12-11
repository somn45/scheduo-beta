import AccountInput from '@/components/common/Input/AccountInput';
import AccountSubmit from '@/components/common/Input/AccountSubmit';
import AccountLabel from '@/components/common/label/AccountLabel';
import {
  INITIAL_JOIN_FORM,
  VALIDATION_JOIN_FORM,
} from '@/components/join/constants/constants';
import useInputValidate from '@/hooks/useInputValidate';
import { inputClickEvent } from '@/types/HTMLEvents';
import { EDIT_USER_PASSWORD } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditPasswordForm() {
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);
  const [editUserPassword] = useMutation(EDIT_USER_PASSWORD);
  const [input, setInput, validateErrorMessage] = useInputValidate(
    {
      ...INITIAL_JOIN_FORM,
      userId: 'passwordchange',
      fullname: '비번변경',
    },
    VALIDATION_JOIN_FORM
  );
  const router = useRouter();

  useEffect(() => {
    if (validateErrorMessage.password || validateErrorMessage.confirmPassword)
      return setIsDisabledSubmit(true);
    return setIsDisabledSubmit(false);
  }, [input, validateErrorMessage]);

  const handleEditPassword = async (e: inputClickEvent) => {
    e.preventDefault();
    const {
      query: { id },
    } = router;

    if (typeof id === 'string') {
      const { data, errors } = await editUserPassword({
        variables: {
          _id: id,
          password: input.password ? input.password : '',
        },
      });
      if (!errors) router.push(`/users/${id}/edit`);
    }
  };
  return (
    <section>
      <article>
        <form>
          <AccountLabel caption="새 비밀번호(6자 이상 24자 이하)" />
          <AccountInput
            name="password"
            value={input.password ? input.password : ''}
            onChange={setInput}
            errorMsg={
              validateErrorMessage.password ? validateErrorMessage.password : ''
            }
          />

          <AccountLabel caption="새 비밀번호 확인" />
          <AccountInput
            name="confirmPassword"
            value={input.confirmPassword ? input.confirmPassword : ''}
            onChange={setInput}
            errorMsg={
              validateErrorMessage.confirmPassword
                ? validateErrorMessage.confirmPassword
                : ''
            }
          />

          <AccountSubmit
            value="비밀번호 변경"
            onClick={handleEditPassword}
            isDisabledSubmit={isDisabledSubmit}
          />
        </form>
      </article>
    </section>
  );
}
