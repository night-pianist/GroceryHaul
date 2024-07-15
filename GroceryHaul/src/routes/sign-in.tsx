import { SignIn } from "@clerk/clerk-react";
import BackgroundWrapper from '../BackgroundWrapper'; 

export default function SignInPage() {
  return (
    <BackgroundWrapper>
        <SignIn path="/sign-in" />
    </BackgroundWrapper>
  );
}