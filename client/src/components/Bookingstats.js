import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKING_BY_SERVICE_ID } from '../utils/queries';

const BookingStats = ({ serviceId }) => {
  const { loading, error, data } = useQuery(GET_BOOKING_BY_SERVICE_ID, {
    variables: { serviceId },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const { bookingByServiceId } = data;
  const numberOfBookings = bookingByServiceId.length;

  const circleStyle = {
    width: '75px',
    height: '75px',
    borderRadius: '50%',
    backgroundColor: '#f8d7da',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#721c24',
  };

  return (
    <div className="booking-stats mt-5">
      {numberOfBookings === 0 ? (
        <p className='text-center'>No bookings yet. Book this service now!</p>
      ) : (
        <>
          <div style={circleStyle}>
            <span>{numberOfBookings}</span>
          </div>
          <p className='text-center'>{numberOfBookings} users booked this service recently.</p>
        </>
      )}
    </div>
  );
};

export default BookingStats;
