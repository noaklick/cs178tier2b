import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { myKey } from '../config.js';
import Bus from "../components/bus/Bus";

export default function Map({feed, dataLoading}) {
    const containerStyle = {
        width: '1000px',
        height: '1000px'
    };

    const center = {
        lat: 42.372660,
        lng: -71.118660
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: myKey
    });

    return (
        <div>
            <p>Welcome to HarvHop!</p>
            {isLoaded && !dataLoading && (
             <GoogleMap
             mapContainerStyle={containerStyle}
             center={center}
             zoom={15}>
                <ul>
                    {/* Displaying all the buses on map */}
                    {feed.vehiclePositions.entity.map(entity => {return <Bus entity={entity}/>})}
                </ul>
             </GoogleMap>)}
        </div>
    );
}