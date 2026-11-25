import { ProfileForm } from "@/components/profile-form";
import { RequireAuth } from "@/components/require-auth";

export const metadata = {
  title: "Mi perfil",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RequireAuth>
        <ProfileForm />
      </RequireAuth>
    </div>
  );
}
