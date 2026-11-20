const invalidErrorMessage = "Please check if the email address you've entered is correct.";
const emptyErrorMessage = 'Please enter your email address';

export const INVALID_EMAIL_CASES = [
  {
    title: 'missing domain',
    email: 'test@',
    expectedError: invalidErrorMessage,
  },
  {
    title: 'missing local part and domain zone',
    email: '@test',
    expectedError: invalidErrorMessage,
  },
  {
    title: 'missing local part before @',
    email: '@test.com',
    expectedError: invalidErrorMessage,
  },
  {
    title: 'missing @ symbol',
    email: 'test.com',
    expectedError: invalidErrorMessage,
  },
  {
    title: 'empty email',
    email: '',
    expectedError: emptyErrorMessage,
  },
] as const;
