"use client";
import { categories } from "@/app/components/navbar/Categories";
import { Listing, User } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";
import { SafeReservation } from "@/app/types";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};
interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: Listing & {
    user: User;
  };
  currentUser?: User | null;
}
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  console.log("Original reservations:", reservations);

  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    // Debug original reservations
    console.log("Original reservations:", reservations);

    const dateSet = new Set<string>();
    const result: Date[] = [];

    reservations.forEach((reservation) => {
      try {
        // Clone dates to avoid mutation
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        // Normalize to local time midnight
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Debug individual reservation
        console.log(`Processing reservation from ${start} to ${end}`);

        let current = new Date(start);
        while (current <= end) {
          const dateKey = current.toDateString(); // Use local date string
          if (!dateSet.has(dateKey)) {
            dateSet.add(dateKey);
            result.push(new Date(current));
            console.log(`Added disabled date: ${current}`);
          }
          current.setDate(current.getDate() + 1);
        }
      } catch (error) {
        console.error("Error processing reservation:", reservation, error);
      }
    });

    console.log("Final disabled dates:", result);
    return result;
  }, [reservations]);

  console.log("DISABLED DATES:", disabledDates);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select valid start and end dates.");
      setIsLoading(false);
      return;
    }

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);

        router.push('/trips');
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div
            className="
                grid
                grid-cols-7
                md:grid-cols-7
                md:gap-10
                mt-6
                "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div
              className="
                    order-first
                    mb-10
                    md:order-last
                    md:col-span-3
                    "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default ListingClient;
