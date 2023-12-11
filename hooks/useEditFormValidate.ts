import { ChangeEvent, useEffect, useState } from 'react';

export interface EditForm {
  fullname?: string;
  email?: string;
  company?: string;
}

type ValidateMethod = (accountForm: EditForm) => boolean;

interface ValidateEditResponse {
  fullname?: string;
  email?: string;
  company?: string;
}

type ValidationMap = Map<ValidateMethod, ValidateEditResponse>;

type userEditFormValidateType = (
  form: EditForm,
  validationMap: ValidationMap
) => [EditForm, (e: ChangeEvent<HTMLInputElement>) => void, EditForm];

const DEFAULT_ERROR_MSG: EditForm = {
  fullname: '',
  email: '',
  company: '',
};

const useEditFormValidate: userEditFormValidateType = (form, validationMap) => {
  const [input, setInput] = useState(form);
  const [errorMessage, setErrorMessage] = useState<EditForm>(DEFAULT_ERROR_MSG);

  useEffect(() => {
    for (let [validateMethods, errorMessageValue] of validationMap) {
      if (validateMethods(input)) return setErrorMessage(errorMessageValue);
    }
    return setErrorMessage(DEFAULT_ERROR_MSG);
  }, [input]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const {
      target: { name, value },
    } = e;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  return [input, onChange, errorMessage];
};

export default useEditFormValidate;
