import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

const OrderRouteMap = () => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [eta, setEta] = useState('');
    const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
    const location = useLocation();
    const customerLocation = location.state?.customerLocation;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=@Google-api-key &libraries=places`; // Use your actual API key here
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            setMapLoaded(true);
            initMap();
        };

        script.onerror = () => {
            console.error("Google Maps script failed to load.");
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [mapLoaded]);

    const initMap = () => {
        if (!mapLoaded || !customerLocation) return;

        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const bikeIcon = {
                    url: 'http://maps.google.com/mapfiles/ms/icons/motorcycling.png',
                    scaledSize: new window.google.maps.Size(32, 32)
                };

                const customerIcon = {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32)
                };

                new window.google.maps.Marker({
                    position: currentLocation,
                    map: map,
                    icon: bikeIcon,
                    title: "Your Location"
                });

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ 'address': customerLocation.city }, (results, status) => {
                    if (status === 'OK') {
                        map.setCenter(results[0].geometry.location);
                        new window.google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            icon: customerIcon,
                            title: customerLocation.city
                        });

                        const directionsService = new window.google.maps.DirectionsService();
                        const directionsRenderer = new window.google.maps.DirectionsRenderer();
                        directionsRenderer.setMap(map);

                        directionsService.route({
                            origin: currentLocation,
                            destination: results[0].geometry.location,
                            travelMode: window.google.maps.TravelMode.DRIVING,
                        }, (response, status) => {
                            if (status === 'OK') {
                                directionsRenderer.setDirections(response);
                                const duration = response.routes[0].legs[0].duration.text;
                                setEta(`Estimated travel time: ${duration}`);
                            } else {
                                console.error('Directions request failed due to ' + status);
                            }
                        });
                    } else {
                        console.error('Geocode was not successful for the following reason: ' + status);
                    }
                });
            },
            (error) => {
                console.error("Geolocation error:", error);
            }
        );
    };

    const handleDeliveryConfirmation = () => {
        console.log("Notifying customer of delivery...");
        setDeliveryConfirmed(true); // Simulate notifying the customer
    };

    return (
        <Helmet title="Order Route Map">
            <CommonSection title="Order Route Map" />
            <div>
                {mapLoaded ? (
                    <div>
                        <div id="map" style={{ width: '100%', height: '400px' }}></div>
                        <p>{eta}</p>
                        {deliveryConfirmed ? (
                            <p>Delivery has been confirmed to the customer.</p>
                        ) : (
                            <button onClick={handleDeliveryConfirmation} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', cursor: 'pointer' }}>
    Confirm Delivery
</button>

                        )}
                    </div>
                ) : (
                    <div>Loading map...</div>
                )}
            </div>
        </Helmet>
    );
};

export default OrderRouteMap;




