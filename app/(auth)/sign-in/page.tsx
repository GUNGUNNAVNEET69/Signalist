"use client";

import FooterLink from "@/components/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black flex justify-center items-start py-16">
      <div className="max-w-3xl w-full mx-auto p-8 bg-[#0d0d0dcf] backdrop-blur-xl rounded-2xl border border-gray-800 shadow-[0_0_25px_rgba(255,255,0,0.15)] animate-slideUp">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6 tracking-wide">
          Welcome Back!
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="email"
              label="Email Address"
              placeholder="example@email.com"
              type="email"
              register={register}
              error={errors.email}
              validation={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              disabled={isSubmitting}
            />

            <InputField
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              register={register}
              error={errors.password}
              validation={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl py-3 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <FooterLink
            text="Don't have an account?"
            href="/sign-up"
            linkText="Create Account"
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
