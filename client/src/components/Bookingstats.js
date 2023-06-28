import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKING_BY_SERVICE_ID } from '../utils/queries';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  };

  const cardStyle = {
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  };

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

  const bookedDatesStyle = {
    marginTop: '20px',
  };

  const bookedDates = bookingByServiceId.map((booking) => {
    const date = new Date(`${booking.date} ${booking.time}`);
    const formattedDate = date.toLocaleDateString('en-US');
    return formattedDate;
  });
  const formattedBookedDates = bookedDates.map(date => new Date(date));
  return (
    <div className="booking-stats mt-5" style={containerStyle}>
      <div style={cardStyle}>
        {numberOfBookings === 0 ? (
          <p className="text-center">No bookings yet. Book this service now!</p>
        ) : (
          <>
            <div style={circleStyle} className='mb-5'>
              <Badge value={numberOfBookings} severity="danger" />
            </div>
            <p className="text-center">{numberOfBookings} users booked this service recently.</p>
            <div className="booking-details">
              {bookingByServiceId.map((booking) => (
                <div key={booking._id} className="booking-item"></div>
              ))}
            </div>
          </>
        )}
      </div>
      

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FaCalendarAlt style={{ fontSize: '24px', marginRight: '10px' }} />
          <h5>Booked Dates and Time</h5>
        </div>
        <div className="booked-dates" style={bookedDatesStyle}>
          {bookingByServiceId.length === 0 ? (
            <p className="text-center">No booked dates and times available.</p>
          ) : (
            <Calendar
            value={formattedBookedDates}
            tileContent={({ date }) =>
              formattedBookedDates.some(
                bookedDate => bookedDate.toDateString() === date.toDateString()
              ) ? (
                <div className="highlight" />
              ) : null
            }
          />
          
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingStats;
