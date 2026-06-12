const firebaseConfig = {

apiKey:"YOUR_API_KEY",

databaseURL:"YOUR_DATABASE_URL"

};

firebase.initializeApp(firebaseConfig);

const db=firebase.database();

db.ref("greenhouse1").on("value",(snapshot)=>{

let data=snapshot.val();

document.getElementById("temp").innerHTML=
data.temperature+" °C";

document.getElementById("hum").innerHTML=
data.humidity+" %";

document.getElementById("light").innerHTML=
data.light+" lux";

document.getElementById("soil").innerHTML=
data.soil+" %";

});
