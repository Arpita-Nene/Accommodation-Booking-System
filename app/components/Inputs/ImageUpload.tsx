'use client';
import {CldUploadWidget} from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import {TbPhotoPlus} from "react-icons/tb";

declare global{
    var cloudinary: any;
}

interface ImageUploadProps{
    onChange:(value:string)=>void;
    value:string;
}

const ImageUpload:React.FC<ImageUploadProps>= ({
    onChange,
    value
})=>{
    const handleUpload=useCallback(
      (result:any) => {
        console.log("Upload result", result);
        console.log("run ho ja plzz");
        onChange(result.info.secure_url)
      },
      [onChange],
    );
    // const handleUpload = useCallback(
    //     (result: any) => {
    //       console.log("Upload result", result);
    //       if (result.event === "success") {
    //         onChange(result.info.secure_url);
    //       }
    //     },
    //     [onChange]
    //   );
    
    return(
        <div>
            <CldUploadWidget
           
           onSuccess={handleUpload}
            uploadPreset="newpreset"
            options={{
                maxFiles:1,
                cloudName: "db41yxkzb"

            }}
            
            >
                {({open})=>{
                return (
                    <div onClick={()=>open?.()}
                    className="
                    relative
                    cursor-pointer
                    hover:opacity-70
                    transition
                    border-dashed
                    border-2
                    p-20
                    border-neutral-300
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-4
                    text-neutral-600">
                    <TbPhotoPlus size={50}/>
                    <div className="font-semibold text-lg">
                        Click to Upload
                    </div>
                    {value &&(
                        <div className="absolete inset-0 w-full h-full">
                            <Image  
                            alt="Upload"
                            fill
                            style={{objectFit:'cover'}}
                            src={value}
                            />
                        </div>
                        // <div className="relative w-[300px] h-[200px]">
                        //     <Image
                        //         alt="Upload"
                        //         src={value}
                        //         fill
                        //         className="object-cover"
                        //     />
                        //  </div>
                    )}
                    </div>
                )
                }}
            </CldUploadWidget>
        </div>
    )
}
export default ImageUpload;