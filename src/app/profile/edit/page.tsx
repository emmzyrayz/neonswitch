"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { LuCamera, LuSave, LuCircleAlert } from "react-icons/lu";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "Nnamdi Emmanuel",
    email: "nnamdi.emmanuel@example.com",
    phone: "+234 812 345 6789",
    address: "Lagos, Nigeria",
    dateOfBirth: "1995-06-15",
    bvn: "",
    nin: "",
  });

  const [verificationDocs, setVerificationDocs] = useState({
    idCard: null as File | null,
    proofOfAddress: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof verificationDocs) => {
    const file = e.target.files?.[0] || null;
    setVerificationDocs({
      ...verificationDocs,
      [type]: file,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData, verificationDocs);
  };

  return (
    <div className={clsx("space-y-6", "sm:space-y-8", "text-muted", "max-w-3xl")}>
      <div>
        <h2 className={clsx("text-2xl", "sm:text-3xl", "font-bold", "mb-2")}>Edit Profile</h2>
        <p className="text-sm sm:text-base text-gray-600">Update your personal information and verification documents</p>
      </div>

      <form onSubmit={handleSubmit} className={clsx("space-y-6", "sm:space-y-8")}>
        {/* Profile Picture Section */}
        <section className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6")}>
          <h3 className="text-base sm:text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className={clsx(
              "w-20 h-20",
              "sm:w-24 sm:h-24",
              "rounded-xl",
              "sm:rounded-2xl",
              "bg-linear-to-br from-blue-500 to-purple-600",
              "flex items-center justify-center",
              "text-white",
              "text-2xl",
              "sm:text-3xl",
              "font-bold"
            )}>
              {formData.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <label className={clsx(
              "flex items-center justify-center gap-2",
              "border-2 border-muted",
              "rounded-xl",
              "px-4 py-2",
              "cursor-pointer",
              "hover:bg-gray-50",
              "active:bg-gray-100",
              "transition-colors",
              "touch-manipulation",
              "text-sm",
              "w-full",
              "sm:w-auto"
            )}>
              <LuCamera className="w-4 h-4 sm:w-5 sm:h-5" />
              Upload Photo
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
          <h3 className="text-base sm:text-lg font-semibold">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>
          </div>
        </section>

        {/* KYC Verification Section */}
        <section className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">KYC Verification</h3>
            <p className="text-xs sm:text-sm text-gray-600">Complete your verification to unlock all features</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                BVN (Bank Verification Number)
              </label>
              <input
                type="text"
                name="bvn"
                value={formData.bvn}
                onChange={handleInputChange}
                maxLength={11}
                placeholder="22234567890"
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>

            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                NIN (National Identity Number)
              </label>
              <input
                type="text"
                name="nin"
                value={formData.nin}
                onChange={handleInputChange}
                maxLength={11}
                placeholder="12345678901"
                className={clsx(
                  "w-full",
                  "border-2",
                  "border-muted",
                  "rounded-xl",
                  "px-3",
                  "sm:px-4",
                  "py-2",
                  "sm:py-2.5",
                  "text-sm",
                  "sm:text-base",
                  "focus:outline-none",
                  "focus:border-blue-500"
                )}
              />
            </div>
          </div>
        </section>

        {/* Document Upload Section */}
        <section className={clsx("border-2", "border-muted", "rounded-xl", "sm:rounded-2xl", "p-4", "sm:p-6", "space-y-4", "sm:space-y-5")}>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">Verification Documents</h3>
            <p className="text-xs sm:text-sm text-gray-600">Upload clear photos of your documents</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Government-issued ID Card
              </label>
              <div className={clsx(
                "border-2 border-dashed border-muted rounded-xl p-4 sm:p-6 text-center"
              )}>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'idCard')}
                  accept="image/*,.pdf"
                  className="hidden"
                  id="idCard"
                />
                <label htmlFor="idCard" className="cursor-pointer touch-manipulation">
                  {verificationDocs.idCard ? (
                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                      ✓ {verificationDocs.idCard.name}
                    </p>
                  ) : (
                    <>
                      <LuCamera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm text-gray-600">Click to upload ID Card</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (Max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className={clsx('block', 'text-xs', 'sm:text-sm', 'font-medium', 'mb-2')}>
                Proof of Address
              </label>
              <div className={clsx(
                "border-2 border-dashed border-muted rounded-xl p-4 sm:p-6 text-center"
              )}>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  accept="image/*,.pdf"
                  className="hidden"
                  id="proofOfAddress"
                />
                <label htmlFor="proofOfAddress" className="cursor-pointer touch-manipulation">
                  {verificationDocs.proofOfAddress ? (
                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                      ✓ {verificationDocs.proofOfAddress.name}
                    </p>
                  ) : (
                    <>
                      <LuCamera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm text-gray-600">Click to upload Proof of Address</p>
                      <p className="text-xs text-gray-500 mt-1">Utility bill or bank statement</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className={clsx("flex items-start gap-2 bg-blue-50 p-3 sm:p-4 rounded-xl")}>
            <LuCircleAlert className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-800">
              Your documents will be securely stored and only used for verification purposes. Processing typically takes 24-48 hours.
            </p>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            className={clsx(
              "flex items-center justify-center gap-2",
              "bg-gray-800",
              "text-white",
              "rounded-xl",
              "px-5 sm:px-6",
              "py-2.5 sm:py-3",
              "text-sm",
              "font-medium",
              "hover:bg-gray-700",
              "active:bg-gray-900",
              "transition-colors",
              "touch-manipulation"
            )}
          >
            <LuSave className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>

          <button
            type="button"
            className={clsx(
              "flex items-center justify-center",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-5 sm:px-6",
              "py-2.5 sm:py-3",
              "text-sm",
              "font-medium",
              "hover:bg-gray-50",
              "active:bg-gray-100",
              "transition-colors",
              "touch-manipulation"
            )}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}