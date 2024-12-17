'use client';
import { FramerClientSDK, getSession } from '@framer/FramerServerSDK/client';
import { useEffect } from 'react';
import { useToast } from '../components/Toasts/ToastProvider';
import { ToastTypes } from '../components/Toasts/GenericToast';
import { PAGES } from '../lib/constants';
import { useRouter } from 'next/navigation';

let fired_signup = false;
export default function Dashboard() {
  const router = useRouter();
  const clientSdk = FramerClientSDK();
  const { addToast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      // If we have a session, then we can run the signup flow on the server.
      if (session && !fired_signup) {
        fired_signup = true;
        const loadingToast = addToast(
          ToastTypes.LOADING,
          'Setting up your stuff...',
          'infinite'
        );
        // Attempt to sign up the user. This is safe to call even if the user already exists.
        const signup = await clientSdk.user.signup({});
        if ('error' in signup) {
          loadingToast.clearToast();
          console.error('Error signing up user: ', signup.error);
          addToast(ToastTypes.ERROR, 'Error when signing up.', 'infinite');
          return;
        }
        loadingToast.clearToast();

        // We push them to the Dashboard page.
        router.push(PAGES.DASHBOARD);
      }
    };

    checkSession();
  });
  return <div>Setting up your stuff...</div>;
}
