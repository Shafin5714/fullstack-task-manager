import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }).email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password is required.",
    })
    .min(6, {
      message: "Password must be at least 6 characters.",
    }),
});

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
};

const LoginPage = () => {
  // hooks
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    const res = await axios.post<LoginResponse>("/user/login", {
      email,
      password,
    });

    if (res.data.success) {
      setAuthData(res.data.data, res.data.token);
      toast.success(res.data.message);
      navigate("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full flex flex-col items-center">
        <div className="text-center my-5">
          <h2 className="font-bold text-4xl text-blue-600">TaskFlow</h2>
          <p className="mt-2">Professional Task Manager</p>
        </div>

        <Card className="w-full max-w-md shadow-lg sm:shadow-xl">
          <CardHeader className="space-y-1 px-4 pt-6 sm:px-6">
            <CardTitle className="text-xl font-bold sm:text-2xl">
              Login
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your details below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  className="mt-7 h-10 w-full sm:h-11"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : null}
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-4 pb-6 sm:px-6">
            <div className="text-center text-xs text-muted-foreground sm:text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
