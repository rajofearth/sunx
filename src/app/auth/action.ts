'use server';

import { validatedAction } from '@/lib/action-helpers';
import { auth } from '@/lib/auth';
import { LoginSchema, SignUpSchema } from '@/lib/types';

export const signUpEmail = validatedAction(SignUpSchema, async (data) => {
  const { email, password, firstName, lastName } = data;

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: `${firstName} ${lastName}`,
    },
  });

  return { success: true };
});

export const loginEmail = validatedAction(LoginSchema, async (data) => {
  const { email, password } = data;

  await auth.api.signInEmail({
    body: { email, password },
  });

  return { success: true };
});
