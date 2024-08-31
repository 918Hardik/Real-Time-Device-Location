const socket = io();
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(`ERROR(${error.code}): ${error.message}`);
            // Fallback mechanism
        },
        {
            enableHighAccuracy: true,
            timeout: 20000, // Increased timeout to 20 seconds
            maximumAge: 0,
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers={};

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        markers[id].setLatlang([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})