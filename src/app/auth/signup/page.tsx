'use client'
import AuthInput from "../components/authinput";
import NeonButton from "../components/neonbutton";
import AuthCard from "../components/authcard";
import ParticleBackground from "../components/particlebackground";
import Link from "next/link";
import clsx from "clsx";
import { SORTED_COUNTRIES } from "@/lib/countries";
import { parsePhoneNumber, formatPhoneAsYouType, getPhoneExample } from "@/lib/phone";
import { useState, useMemo } from "react";

interface FormData {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  country?: string;
  phone?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    country: 'NG', 
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPhoneFormatted, setIsPhoneFormatted] = useState(false);
  
  const phonePlaceholder = useMemo(() => {
    return getPhoneExample(formData.country);
  }, [formData.country]);

  // Derive phoneDisplay from formData instead of storing it separately
  const phoneDisplay = useMemo(() => {
    if (!formData.phone) return '';
    
    // If phone was validated and formatted on blur, show raw value
    // Otherwise format as user types
    if (isPhoneFormatted) {
      return formData.phone;
    }
    
    const formatted = formatPhoneAsYouType(formData.phone, formData.country);
    return formatted.display;
  }, [formData.phone, formData.country, isPhoneFormatted]);


  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, country }));
    setErrors(prev => ({ ...prev, phone: undefined }));
    setIsPhoneFormatted(false);
  };

  // Handle phone input change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneAsYouType(rawValue, formData.country);
    
    setIsPhoneFormatted(false);
    setFormData(prev => ({ ...prev, phone: formatted.raw }));
    setErrors(prev => ({ ...prev, phone: undefined }));
  };

  // Validate phone on blur
  const handlePhoneBlur = () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }

    const result = parsePhoneNumber(formData.phone, formData.country);
    if (!result.valid) {
      setErrors(prev => ({ ...prev, phone: result.error }));
      setIsPhoneFormatted(false);
    } else {
      setErrors(prev => ({ ...prev, phone: undefined }));
      // Update display with properly formatted number
      const formattedPhone = result.nationalFormat || formData.phone;
      setFormData(prev => ({ ...prev, phone: formattedPhone }));
      setIsPhoneFormatted(true);
    }
  };

  // Handle other form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneResult = parsePhoneNumber(formData.phone, formData.country);
      if (!phoneResult.valid) newErrors.phone = phoneResult.error;
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Format final phone number
    const phoneResult = parsePhoneNumber(formData.phone, formData.country);
    const finalFormData = {
      ...formData,
      phone: phoneResult.formatted || formData.phone
    };
    
    console.log('Submitting:', finalFormData);
    // Here you would typically send to your API
    // await submitForm(finalFormData);
  };

  // Prepare country options for select
  const countryOptions = SORTED_COUNTRIES.map(country => ({
    value: country.code,
    label: `${country.name} (+${country.callingCode})`
  }));

  
  return (
    <div
      className={clsx(
        "min-h-screen w-screen md:mt-0 mt-5",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#0a0a0a]",
        "relative"
      )}
    >
      <ParticleBackground />
      <div className={clsx("relative w-full flex items-center justify-center md:p-4 p-2", "z-10")}>
        <AuthCard>
          <h2
            className={clsx(
              "md:text-3xl text-xl",
              "text-soft",
              "font-bold",
              "mb-6",
              "font-mono"
            )}
          >
            Create Account
          </h2>
          <form className={clsx("flex", "flex-col")} onSubmit={handleSubmit}>
            <AuthInput
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              error={errors.fullName}
            />
            
            <AuthInput
              label="Email"
              name="email"
              placeholder="example@mail.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={errors.email}
            />
            
            <AuthInput
              label="Country"
              name="country"
              type="select"
              options={countryOptions}
              value={formData.country}
              onChange={handleCountryChange}
              required
              error={errors.country}
            />
            
            <div className={clsx('flex', 'flex-col', 'mb-4')}>
              <label className={clsx('text-muted', 'mb-1', 'font-mono')}>
                Phone <span className="text-red-500">*</span>
              </label>
              <div className={clsx('flex', 'items-center')}>
                <div className={clsx('shrink-0', 'mr-2')}>
                  <div className={clsx(
                    'px-3',
                    'py-2',
                    'rounded-l-md',
                    'bg-[#2a2a2a]',
                    'border',
                    errors.phone ? 'border-red-500' : 'border-soft',
                    'text-white',
                    'text-sm'
                  )}>
                    +{SORTED_COUNTRIES.find(c => c.code === formData.country)?.callingCode}
                  </div>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={phonePlaceholder}
                  value={phoneDisplay}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  className={clsx(
                    'grow',
                    'px-4',
                    'py-2',
                    'rounded-r-md',
                    'bg-[#1a1a1a]',
                    'border',
                    errors.phone ? 'border-red-500' : 'border-soft',
                    'focus:border-muted',
                    'focus:ring-2',
                    'focus:ring-soft',
                    'text-white',
                    'outline-none',
                    'transition-all',
                    'duration-300'
                  )}
                />
              </div>
              {errors.phone && (
                <p className={clsx('text-red-500', 'text-xs', 'mt-1')}>{errors.phone}</p>
              )}
              <p className={clsx('text-gray-400', 'text-xs', 'mt-1')}>
                {formData.country ? `Enter phone number for ${SORTED_COUNTRIES.find(c => c.code === formData.country)?.name}` : 'Select a country first'}
              </p>
            </div>
            
            <AuthInput
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              required
              error={errors.dob}
            />
            
            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              required
              error={errors.password}
            />
            
            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              error={errors.confirmPassword}
            />
            
            <NeonButton className="mt-4" >
              Register
            </NeonButton>
          </form>
          <p className={clsx("text-white", "mt-4", "text-sm")}>
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className={clsx("text-soft/60 hover:text-soft", "underline")}
            >
              Login
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
