import AuthGuard from "@/components/auth/AuthGuard";
import AuthLayout from "@/layouts/AuthLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <AuthLayout>{children}</AuthLayout>
    </AuthGuard>
  );
}

export default Layout; 