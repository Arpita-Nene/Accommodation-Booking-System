'use client';
import useRentModel from "@/app/hooks/useRentModel";
import Modal from "./Modal";
import Heading from "../Heading";
import { useMemo, useState } from "react";
import { categories } from "../navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import {  FieldValues, useForm, SubmitHandler } from "react-hook-form"; 
import CountrySelect from "../Inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS{
    CATEGORY=0,
    LOCATION=1,
    INFO=2,
    IMAGES=3,
    DESCRIPTION=4,
    PRICE=5
}
const  RentModel=()=>{
    const router=useRouter();
    const rentModel=useRentModel();
    const [step, setstep] = useState(STEPS.CATEGORY);
const [isLoading,setIsLoading]=useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState:{
            errors,
        },
       reset
     } = useForm<FieldValues>({
        defaultValues:{
            category: '',
            location: null,
            guestCount: 1,
            roomCount:1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title:'',
            description:''
        }
     });

     const category = watch('category');
     const location= watch('location');
     const guestCount=watch('guestCount');
     const roomCount=watch('roomCount');
     const bathroomCount=watch('bathroomCount');
     const imageSrc=watch('imageSrc');

     const Map=useMemo(()=>dynamic(()=>import('../Map'),{
        ssr:false
     }),[location]);

     const setCustomValue= (id: string, value:any)=>{
        setValue(id,value,{
            shouldValidate:true,
            shouldDirty:true,
            shouldTouch:true
           
        })
     }

    const onBack=()=>{
        setstep((value)=>value-1);
    };
    const onNext=()=>{
        setstep((value)=>value+1);
    }
    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
        if(step!==STEPS.PRICE){
            return onNext();
        }
        setIsLoading(true);
        axios.post('/api/listings',data)
        .then(()=>{
            toast.success('Listing Created');
            router.refresh();
            reset();
            setstep(STEPS.CATEGORY);
            rentModel.onClose();
        })
        .catch(()=>{
            toast.error('Something went wrong');
        }).finally(()=>{
            setIsLoading(false);
        })
    }
    const actionLabel=useMemo(() => {
        if(step === STEPS.PRICE){
            return 'Create';
        }
        return 'Next';
    }, [step]);
    const secondaryActionLabel=useMemo(() => {
        if(step === STEPS.CATEGORY){
            return undefined;
        }
        return 'Back';
    }, [step])

    let bodyContent=(
        <div className="flex flex-col gap-8">
            <Heading
            title="Which of this best descibes your place?"
            subtitle="pick a category"
            />
            <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto

            ">
                {categories.map((item)=>(
                    <div key={item.label} className="co-span-1">
                        <CategoryInput
                        onClick={(category)=>setCustomValue('category',category)}
                        selected={category===item.label}
                        label={item.label}
                        icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if(step === STEPS.LOCATION){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading 
                title="Where is your place Located?"
                subtitle="Help guests find you!"
                />
                <CountrySelect
                value={location}
                onChange={(value)=>setCustomValue('location',value)}
                />
                <Map center={location?.latlng} />
             
            </div>

        )
    }
    if (step === STEPS.INFO){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading 
                title="Share some basics about your place"
                subtitle="What amenities do you have?"
                />
                <Counter 
                title="Guests"
                subtitle="How many guests do you allow?"
                value={guestCount}
                onChange={(value)=>setCustomValue('guestCount',value)}
                />
                <hr/>
                <Counter 
                title="Rooms"
                subtitle="How many rooms do you have?"
                value={roomCount}
                onChange={(value)=>setCustomValue('roomCount',value)}
                />
                <hr/>
                <Counter 
                title="Bathrooms"
                subtitle="How many bathroom do you have?"
                value={bathroomCount}
                onChange={(value)=>setCustomValue('bathroomCount',value)}
                />
            </div>
        )
    }
    if(step ===STEPS.IMAGES){
        bodyContent=(
            <div className="flex flex-col gap-4">
                <Heading
                title="Add a photo of your place"
                subtitle="Show guests what place looks like!"
                />
                <ImageUpload
                value={imageSrc}
                onChange={(value)=>setCustomValue('imageSrc',value)}
                />
            </div>
        )
    }

    if(step === STEPS.DESCRIPTION){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading
                title="How would you describe your place?"
                subtitle="Short and sweet works best!"
                />
                <Input
                id="title"
                label="Title"
                register={register}
                errors={errors}
                required
                />
                <hr/>
                <Input
                id="description"
                label="Description"
                register={register}
                errors={errors}
                required
                />
            </div>
        )
    }
    if(step===STEPS.PRICE){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading
                title="Now,set your Price"
                subtitle="How much do you charge per night?"
                />
                <Input
                id="price"
                label="Price"
                formatPrice
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />
            </div>
        )
    }
    return(
    
        <Modal 
        isOpen={rentModel.isOpen}
        onClose={rentModel.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="CozyHut your home!"
        body={bodyContent}
        />
    )
}
export default RentModel;