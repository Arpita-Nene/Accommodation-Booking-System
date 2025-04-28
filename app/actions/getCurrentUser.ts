import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";

export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getCurrentUser(): Promise<User | null> {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }

        return await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });
    } catch (error: any) {
        return null;
    }
}