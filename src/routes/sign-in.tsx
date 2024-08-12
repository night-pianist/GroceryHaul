import BackgroundWrapper from '../BackgroundWrapper'; 
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <BackgroundWrapper>
        <SignIn path="/sign-in" />
    </BackgroundWrapper>
  );
}