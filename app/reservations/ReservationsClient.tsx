'use client';

import { toast } from "react-hot-toast";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Reservation, User } from '@prisma/client';
import Heading from "../components/Heading";
import Container from "../components/Container";
import axios from "axios";
import { SafeReservation } from "../types";

interface ReservationsClientProps{
    reservations: SafeReservation[];
    currentUser?: User;
}
const ReservationsClient:React.FC<ReservationsClientProps>= ({
    reservations,
    currentUser
})=>{
    const router= useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string)=>{
        setDeletingId(id);
        axios.delete(`/api/reservations/${id}`)
        .then(()=>{
            toast.success("Reservation cancelled");
            router.refresh();
        })
        .catch(()=>{
            toast.error('Something went wrong')
        })
        .finally(()=>{
            setDeletingId('');
        })
    },[router]);
    return(
        <Container>
            <Heading
            title="Reservations"
            subtitle="Bookings on your properties"
            />
        </Container>
    )
}
export default ReservationsClient;