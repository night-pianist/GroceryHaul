import { SignUp } from "@clerk/clerk-react"
import BackgroundWrapper from '../BackgroundWrapper'; 

export default function SignInPage() {
  return (
    <BackgroundWrapper>
        <SignUp path="/sign-up" />
    </BackgroundWrapper>
  );
}