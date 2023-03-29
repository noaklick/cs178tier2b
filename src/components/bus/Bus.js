import { Marker } from '@react-google-maps/api';

function getBusPosition(entity) {
    const pos = {
        lat: parseFloat(entity.vehicle.position.latitude),
        lng: parseFloat(entity.vehicle.position.longitude)
    };
    return pos
}

export default function Bus({entity}) {
    // Bus position
    const position = getBusPosition(entity);
    console.log("Bus Position", position)

    return (
        <Marker
            position={position}
        />
    );
}