import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import {NextResponse} from "next/server";
export async function POST(
    request:Request
){
    const body=await request.json();
    const{
        email,
        name,
        password
    }=body;
    const hashedPassword = await bcrypt.hash(password,12);
    const user= await prisma.user.create({
        data:{
            email,
            name,
            hashedPassword
        }
    });
    return NextResponse.json(user);
}
// import bcrypt from "bcrypt";
// import prisma from "@/app/libs/prismadb";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { email, name, password } = body;

//   if (!email || !name || !password) {
//     return new NextResponse("Missing fields", { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 12);

//   try {
//     const user = await prisma.user.create({
//       data: {
//         email,
//         name,
//         hashedPassword,
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("Registration error:", error);
//     return new NextResponse("Email already in use or DB error", { status: 400 });
//   }
// }
