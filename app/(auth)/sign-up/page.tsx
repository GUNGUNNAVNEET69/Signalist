"use client";

import FooterLink from "@/components/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {
  COUNTRIES,
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


/**
 * SignUp component
 *
 * This component is used to sign up users to the application.
 *
 * It renders a form with the following fields:
 *   - Full Name
 *   - Email Address
 *   - Password
 *   - Country
 *   - Investment Goals
 *   - Risk Tolerance
 *   - Preferred Industry
 *
 * Once the form is submitted, the component will call the signUpWithEmail action creator
 * and pass the form data to it.
 *
 * The component also renders a button to submit the form and a link to sign in if the user already has an account.
 */
const SignUp = () => {

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "India",
      investmentGoals: "Growth",
      riskTolerance: "medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data)
      if (result.success) {
        router.push("/")
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign-UP failed, please try again.",{
        description:error instanceof Error ? error.message : "Failed to create an account"
      })
    }
  };

  return (
    <div className=" bg-black flex justify-center items-start py-16">
      <div className="max-w-3xl w-full mx-auto p-8 bg-[#0d0d0dcf] backdrop-blur-xl rounded-2xl border border-gray-800 shadow-[0_0_25px_rgba(255,255,0,0.15)] animate-slideUp">

        <h1 className="text-3xl font-semibold text-gray-100 mb-6 tracking-wide">
          Sign Up & Personalize Your Investing Journey
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InputField
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              register={register}
              error={errors.fullName}
              validation={{
                required: "Full name is required",
                minLength: { value: 2, message: "Too short" },
              }}
              disabled={isSubmitting}
            />

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
              placeholder="Enter a strong password"
              type="password"
              register={register}
              error={errors.password}
              validation={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              disabled={isSubmitting}
            />

            {/* Country untouched */}

            <SelectField
              name="Country"
              label="Country"
              placeholder="Select your Country "
              options={COUNTRIES}
              control={control}
              error={errors.country}
              required
            />
            <SelectField
              name="investmentGoals"
              label="Investment Goals"
              placeholder="Select your investment goals"
              options={INVESTMENT_GOALS}
              control={control}
              error={errors.investmentGoals}
              required
            />

            <SelectField
              name="riskTolerance"
              label="Risk Tolerance"
              placeholder="Select your risk tolerance"
              options={RISK_TOLERANCE_OPTIONS}
              control={control}
              error={errors.riskTolerance}
              required
            />

            <SelectField
              name="preferredIndustry"
              label="Preferred Industry"
              placeholder="Select your preferred Industry"
              options={PREFERRED_INDUSTRIES}
              control={control}
              error={errors.preferredIndustry}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl py-3 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Creating account..." : "Start Your Investing Journey"}
          </Button>
          <FooterLink text="Already have an account" href="/sign-in" linkText="Sign In" />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
