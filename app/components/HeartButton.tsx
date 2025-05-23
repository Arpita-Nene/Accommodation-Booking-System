'use client';
import  {User} from '@prisma/client';
import {  AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
interface HeartButtonProps{
    listingId:string;
    currentUser?: User | null
}
import { defaultTheme } from "react-select"
import useFavourite from '../hooks/useFavorite';

const HeartButton:React.FC<HeartButtonProps>=({
    listingId,
    currentUser
})=>{
    const {hasFavourited,toggleFavourite} = useFavourite({
        listingId,
        currentUser
    });


    return(<div onClick={toggleFavourite}
    className=" 
    relaitive
    hover:opacity-80
    transition
    cursor-pointer
    "
    >
        <AiOutlineHeart
        size={28}
        className="
        fill-white
        absolute
        -top-[2px]
        -right-[2px]"
        />
        <AiFillHeart
        size={24}
        className={
            hasFavourited? 'fill-rose-500' : 'fill-neutral-500/70'
        }
        />

    </div>)
}
export default HeartButton;