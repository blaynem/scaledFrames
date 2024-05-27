import {
  FramerClientSDK,
  createSupabaseClient,
} from '@framer/FramerServerSDK/client';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Input,
} from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PAGES } from '../../lib/constants';
import { useToast } from '../Toasts/ToastProvider';
import { ToastTypes } from '../Toasts/GenericToast';

export default function MyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const clientSdk = FramerClientSDK();
  const { addToast } = useToast();

  const [showLoginModal, setShowLoginModal] = useState(false);

  // If the user is already logged in, we're just going to push them to the FrameEditor page.
  useEffect(() => {
    async function checkSession() {
      // Will refresh a session if necessary.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        return router.push(PAGES.DASHBOARD);
      }
      setShowLoginModal(true);
    }

    if (!isOpen) {
      setShowLoginModal(false);
    }

    if (isOpen) {
      checkSession();
    }
  }, [isOpen, supabase, router]);

  const [sentOtp, setSentOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const handleClose = () => {
    setEmail('');
    setEnteredOtp('');
    setSentOtp(false);
    onClose();
  };

  const onGetOTP = async () => {
    const loadingToast = addToast(
      ToastTypes.LOADING,
      'Sending OTP...',
      'infinite'
    );
    const response = await supabase.auth.signInWithOtp({
      email,
    });
    if ('erorr' in response) {
      loadingToast.clearToast();
      addToast(ToastTypes.ERROR, 'There was an error sending the OTP.', 5000);
      return;
    }
    loadingToast.clearToast();
    setSentOtp(true);
  };

  const onVerifyOTP = async () => {
    const loadingToast = addToast(
      ToastTypes.LOADING,
      'Verifying OTP...',
      'infinite'
    );
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: enteredOtp,
      type: 'magiclink',
    });
    if (error) {
      loadingToast.clearToast();
      addToast(ToastTypes.ERROR, error?.message ?? 'Error verifying OTP', 5000);
      return;
    }
    if (!data.session || !data.user) {
      loadingToast.clearToast();
      addToast(ToastTypes.ERROR, 'Unable to get session or user.', 5000);
      return;
    }
    // Attempt to sign up the user. This is safe to call even if the user already exists.
    const signup = await clientSdk.user.signup({});
    if ('error' in signup) {
      loadingToast.clearToast();
      console.error('Error signing up user: ', signup.error);
      addToast(ToastTypes.ERROR, 'Error when signing up.', 'infinite');
      return;
    }
    loadingToast.clearToast();

    setShowLoginModal(false);
    // We push them to the Dashboard page.
    router.push(PAGES.DASHBOARD);
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sentOtp ? onVerifyOTP() : onGetOTP();
    }
  };
  return (
    <Dialog
      open={showLoginModal}
      // We only allow the user to close the modal by clicking the cancel button.
      onClose={() => null}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white p-4 sm:p-6 md:p-12">
          {sentOtp ? (
            <>
              <DialogTitle className="font-bold">Verify OTP</DialogTitle>
              <Description>
                {`Please check your email for your One-Time Password (OTP).`}
              </Description>
              <Input
                value={enteredOtp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEnteredOtp(e.target.value)
                }
                onKeyDown={handleEnterPress}
                autoFocus
                type="text"
                max={6}
                placeholder="6-Digit OTP"
                className="input w-full p-2 border-2 border-gray-200 rounded-md"
              />
              <div className="flex flex-1 gap-4">
                <button
                  className="flex-1 rounded-md bg-slate-200 p-2 text-sm font-semibold text-black shadow-sm hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleClose()}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={onVerifyOTP}
                >
                  Verify OTP
                </button>
              </div>
            </>
          ) : (
            <>
              <DialogTitle className="font-bold">Sign In</DialogTitle>
              <Description>
                {`Whether you're signing up or signing in, all we need is your email.`}
                <br />
                <br />
                {`We'll send you a One-Time Password (OTP) to verify your identity.`}
              </Description>
              <Input
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onKeyDown={handleEnterPress}
                autoFocus
                type="email"
                placeholder="Email"
                className="input w-full p-2 border-2 border-gray-200 rounded-md"
              />
              <div className="flex flex-1 gap-4">
                <button
                  className="flex-1 rounded-md bg-slate-200 p-2 text-sm font-semibold text-black shadow-sm hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleClose()}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={onGetOTP}
                >
                  Get OTP
                </button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
