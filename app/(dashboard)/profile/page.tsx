import type { Metadata } from "next";

import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = { title: "Profile" };

const ProfilePage = () => {
  return <ProfileForm />;
};

export default ProfilePage;
