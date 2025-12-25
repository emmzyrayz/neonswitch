import clsx from "clsx";
import React from "react";

export default function EditProfilePage() {
  return (
    <div className={clsx("space-y-8", "text-muted")}>
      <h2 className={clsx("text-2xl", "font-bold")}>Edit Profile</h2>

      <form className={clsx("space-y-6", "max-w-xl")}>
        <div>
          <label className={clsx('block', 'text-sm', 'mb-1')}>Full Name</label>
          <input
            type="text"
            className={clsx(
              "w-full",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-4",
              "py-2"
            )}
          />
        </div>

        <div>
          <label className={clsx('block', 'text-sm', 'mb-1')}>Email</label>
          <input
            type="email"
            className={clsx(
              "w-full",
              "border-2",
              "border-muted",
              "rounded-xl",
              "px-4",
              "py-2"
            )}
          />
        </div>

        <button
          type="submit"
          className={clsx(
            "border-2",
            "border-muted",
            "rounded-xl",
            "px-6",
            "py-2",
            "text-sm"
          )}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
