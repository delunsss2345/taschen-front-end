"use client";

import { selectCurrentUser } from "@/features/auth";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuardProps = {
    children: React.ReactNode;
};


const AuthGuard = ({ children }: AuthGuardProps) => {
    const currentUser = useAppSelector(selectCurrentUser);
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    if (currentUser) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;
