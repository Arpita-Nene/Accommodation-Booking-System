'use client';
// import { SafeUser } from "@/app/types";
import { User } from "@prisma/client";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
interface NavbarProps{
    // currentUser?: SafeUser | null;
    currentUser?: User | null;
}
//stateless functional component
const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) =>{
 
    return(
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div
            className="
            py-4
            border-b[1px]
            ">
                <Container>
                    <div
                    className="
                    flex
                    flex-row
                    items-center
                    justify-between
                    gap-3
                    md:gap-0
                    ">
                     <div className="flex items-center gap-1.5">  {/* Reduced from gap-2 to gap-1.5 */}
                    <Logo />
                    <span className="text-2xl font-sans font-semibold tracking-normal" style={{ 
                        color: '#7f69bf',
                    }}>
                        CozyHut
                    </span>
                </div>
                        <Search/>
                        <UserMenu currentUser={currentUser}/>
                       
                    </div>
                </Container>

            </div>
            <Categories/>
        </div>
    );
}
export default Navbar;