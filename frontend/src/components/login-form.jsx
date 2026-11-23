import { cn } from "cn";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { signInWithPopup } from "firebase/auth";
import googleProvider, { auth } from "@/firebase";
import useAuth from "@/features/auth/hooks/useAuth";
import { useDispatch } from "react-redux";
import { setInitialized, setLoading, setUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hanldeGoogleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      const response = await login({ token });
      dispatch(setUser(response.user));
      navigate("/", { replace: true });
    } catch (error) {
      dispatch(setUser(null));
      console.log(error.message);
    } finally {
      dispatch(setLoading(false));
      dispatch(setInitialized());
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Welcome to Automate AI
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Sign i to build and manage your AI agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form>
            <FieldGroup>
              <Field>
                {/* <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button> */}
                <Button
                  onClick={hanldeGoogleLogin}
                  variant="outline"
                  type="button"
                  className="h-12 w-full gap-3 rounded-xl border-white/15 bg-white/[0.04] text-sm font-medium text-white transition hover:border-violet-400/50 hover:bg-white/[0.08] hover:text-white
                -mb-7"
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg> */}
                  <FcGoogle className="size-6" />

                  <span className="text-[1rem] font-medium ">
                    Login with Google
                  </span>
                </Button>
              </Field>
              {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
               <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field> 
              <Field>
                 <Button type="submit">Login</Button> 
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field> */}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
