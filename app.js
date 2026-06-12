// =====================================
// GLOBAL VARIABLES
// =====================================

let fanState = false;
let heaterState = false;
let pumpState = false;
let ledState = false;

// =====================================
// CHART DATA ARRAYS
// =====================================

const labels = [];

const g1TempData = [];
const g2TempData = [];

const g1HumData = [];
const g2HumData = [];

const g1LightData = [];
const g2LightData = [];

const g1SoilData = [];
const g2SoilData = [];

// =====================================
// TEMPERATURE CHART
// =====================================

const tempChart = new Chart(
document.getElementById('tempChart'),
{
    type:'line',

    data:{
        labels:labels,

        datasets:[
        {
            label:'Smart GH',
            data:g1TempData,
            borderWidth:2
        },

        {
            label:'Conventional GH',
            data:g2TempData,
            borderWidth:2
        }]
    },

    options:{
        responsive:true
    }
});

// =====================================
// HUMIDITY CHART
// =====================================

const humChart = new Chart(
document.getElementById('humChart'),
{
    type:'line',

    data:{
        labels:labels,

        datasets:[
        {
            label:'Smart GH',
            data:g1HumData
        },

        {
            label:'Conventional GH',
            data:g2HumData
        }]
    }
});

// =====================================
// LIGHT CHART
// =====================================

const lightChart = new Chart(
document.getElementById('lightChart'),
{
    type:'line',

    data:{
        labels:labels,

        datasets:[
        {
            label:'Smart GH',
            data:g1LightData
        },

        {
            label:'Conventional GH',
            data:g2LightData
        }]
    }
});

// =====================================
// SOIL CHART
// =====================================

const soilChart = new Chart(
document.getElementById('soilChart'),
{
    type:'line',

    data:{
        labels:labels,

        datasets:[
        {
            label:'Smart GH',
            data:g1SoilData
        },

        {
            label:'Conventional GH',
            data:g2SoilData
        }]
    }
});

// =====================================
// GREENHOUSE 1 LISTENER
// =====================================

db.ref("greenhouse1")
.on("value",(snapshot)=>{

    const data = snapshot.val();

    if(!data) return;

    // ==================
    // ENVIRONMENT
    // ==================

    document.getElementById("g1Temp")
    .innerHTML =
    data.environment.temperature.toFixed(1)+" °C";

    document.getElementById("g1Hum")
    .innerHTML =
    data.environment.humidity.toFixed(1)+" %";

    document.getElementById("g1Light")
    .innerHTML =
    data.environment.light.toFixed(0)+" Lux";

    document.getElementById("g1Soil")
    .innerHTML =
    data.environment.soil+" %";

    // ==================
    // DEVICE STATUS
    // ==================

    fanState = data.devices.fan;
    heaterState = data.devices.heater;
    pumpState = data.devices.pump;
    ledState = data.devices.led;

    updateStatus(
        "fanStatus",
        data.devices.fan
    );

    updateStatus(
        "heaterStatus",
        data.devices.heater
    );

    updateStatus(
        "pumpStatus",
        data.devices.pump
    );

    updateStatus(
        "ledStatus",
        data.devices.led
    );

    updateVent(
        data.devices.vent
    );

    // ==================
    // CHARTS
    // ==================

    addChartData(
        data.environment.temperature,
        data.environment.humidity,
        data.environment.light,
        data.environment.soil,
        true
    );
});

// =====================================
// GREENHOUSE 2 LISTENER
// =====================================

db.ref("greenhouse2")
.on("value",(snapshot)=>{

    const data = snapshot.val();

    if(!data) return;

    document.getElementById("g2Temp")
    .innerHTML =
    data.environment.temperature.toFixed(1)+" °C";

    document.getElementById("g2Hum")
    .innerHTML =
    data.environment.humidity.toFixed(1)+" %";

    document.getElementById("g2Light")
    .innerHTML =
    data.environment.light.toFixed(0)+" Lux";

    document.getElementById("g2Soil")
    .innerHTML =
    data.environment.soil+" %";

    addChartData(
        data.environment.temperature,
        data.environment.humidity,
        data.environment.light,
        data.environment.soil,
        false
    );
});

// =====================================
// STATUS FUNCTIONS
// =====================================

function updateStatus(id,state){

    let element =
    document.getElementById(id);

    if(state){

        element.innerHTML="ON";
        element.className="on";

    }else{

        element.innerHTML="OFF";
        element.className="off";
    }
}

function updateVent(state){

    let element =
    document.getElementById("ventStatus");

    if(state){

        element.innerHTML="OPEN";
        element.className="on";

    }else{

        element.innerHTML="CLOSED";
        element.className="off";
    }
}

// =====================================
// CHART UPDATE
// =====================================

function addChartData(
temp,
hum,
light,
soil,
smart
){

    const now =
    new Date().toLocaleTimeString();

    if(smart){

        labels.push(now);

        g1TempData.push(temp);
        g1HumData.push(hum);
        g1LightData.push(light);
        g1SoilData.push(soil);

    }else{

        g2TempData.push(temp);
        g2HumData.push(hum);
        g2LightData.push(light);
        g2SoilData.push(soil);
    }

    if(labels.length>20){

        labels.shift();

        g1TempData.shift();
        g2TempData.shift();

        g1HumData.shift();
        g2HumData.shift();

        g1LightData.shift();
        g2LightData.shift();

        g1SoilData.shift();
        g2SoilData.shift();
    }

    tempChart.update();
    humChart.update();
    lightChart.update();
    soilChart.update();
}

// =====================================
// MANUAL CONTROL
// =====================================

function toggleFan(){

    db.ref(
    "greenhouse1/manual/fan")
    .set(!fanState);
}

function toggleHeater(){

    db.ref(
    "greenhouse1/manual/heater")
    .set(!heaterState);
}

function togglePump(){

    db.ref(
    "greenhouse1/manual/pump")
    .set(!pumpState);
}

function toggleLED(){

    db.ref(
    "greenhouse1/manual/led")
    .set(!ledState);
}

// =====================================
// HISTORY TABLE
// =====================================

db.ref("history")
.limitToLast(100)
.on("value",(snapshot)=>{

    let body =
    document.getElementById(
    "historyBody");

    body.innerHTML="";

    snapshot.forEach((child)=>{

        let data = child.val();

        let row =
        document.createElement("tr");

        row.innerHTML=`

        <td>${child.key}</td>
        <td>${data.temperature}</td>
        <td>${data.humidity}</td>
        <td>${data.light}</td>
        <td>${data.soil}</td>

        `;

        body.appendChild(row);

    });
});

// =====================================
// CSV EXPORT
// =====================================

function exportCSV(){

    let table =
    document.getElementById(
    "historyTable");

    let csv=[];

    for(let row of table.rows){

        let cols=[];

        for(let cell of row.cells){

            cols.push(cell.innerText);
        }

        csv.push(cols.join(","));
    }

    let csvFile =
    new Blob(
    [csv.join("\n")],
    {type:"text/csv"}
    );

    let link =
    document.createElement("a");

    link.download =
    "greenhouse_data.csv";

    link.href =
    window.URL.createObjectURL(
    csvFile
    );

    link.click();
}

// =====================================
// GROWTH DATA
// =====================================

db.ref("growth")
.on("value",(snapshot)=>{

    const growth =
    snapshot.val();

    if(!growth) return;

    for(let i=1;i<=4;i++){

        if(growth["week"+i]){

            document.getElementById(
            "h1w"+i)
            .innerHTML=
            growth["week"+i]
            .smart.height;

            document.getElementById(
            "h2w"+i)
            .innerHTML=
            growth["week"+i]
            .control.height;

            document.getElementById(
            "l1w"+i)
            .innerHTML=
            growth["week"+i]
            .smart.leaves;

            document.getElementById(
            "l2w"+i)
            .innerHTML=
            growth["week"+i]
            .control.leaves;
        }
    }
});

// =====================================
// PERFORMANCE INDICATORS
// =====================================

db.ref("results")
.on("value",(snapshot)=>{

    const r =
    snapshot.val();

    if(!r) return;

    document.getElementById(
    "tsi")
    .innerHTML=
    r.temperatureStability+" %";

    document.getElementById(
    "wue")
    .innerHTML=
    r.wue;

    document.getElementById(
    "yieldIncrease")
    .innerHTML=
    r.yieldIncrease+" %";

    document.getElementById(
    "waterSaving")
    .innerHTML=
    r.waterSaving+" %";
});