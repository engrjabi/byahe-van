import "./App.css";
import React, {useEffect, useMemo, useRef, useState} from "react";

function smoothScrollToBottom() {
    const target = document.body.scrollHeight; // get the height of the whole document
    const start = window.scrollY; // get the current scroll position
    const duration = 1000; // set the duration of the scroll in milliseconds
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.easeInOutQuad(timeElapsed, start, target - start, duration);
        window.scrollTo(0, progress);
        if (timeElapsed < duration) requestAnimationFrame(animate);
    }

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animate);
}

function scrollToTop() {
    // Get the current scroll position
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

    if (currentScroll > 0) {
        // Scroll towards the top with an easing function
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
}

function OrderForm() {
    const [costPerTrip, setCostPerTrip] = useState(1440);
    const [driverPerTrip, setDriverPerTrip] = useState(200);
    const [butawPerTrip, setButawPerTrip] = useState(120);
    const [numberOfTrips, setNumberOfTrips] = useState(0);
    const [fuelCost, setFuelCost] = useState(0);
    const [hulog, setHulog] = useState(0);
    const [inputs, setInputs] = useState([[0, ""]]);
    const [selectedName, setSelectedName] = useState('');
    const [loadedCount, setLoadedCount] = useState(0);
    const iframeRef = useRef(null);

    function getCurrentDate() {
        // Get the current date
        var currentDate = new Date();

        // Get the year, month, and day as strings
        var year = currentDate.getFullYear().toString();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        var day = currentDate.getDate().toString().padStart(2, "0");

        // Return the date as a string in the format "YYYY-MM-DD"
        return year + "-" + month + "-" + day;
    }

    const formLink = `https://docs.google.com/forms/d/e/1FAIpQLSeXCGnAO2376A0D7oRqs7VzOWFLAmOr8UUbdne4M4pnW0jkAQ/viewform`;

    const totalButaw = useMemo(() => {
        return numberOfTrips * butawPerTrip;
    }, [numberOfTrips, butawPerTrip]);

    const totalGross = useMemo(() => {
        return numberOfTrips * costPerTrip;
    }, [numberOfTrips, butawPerTrip]);

    const totalDriver = useMemo(() => {
        return numberOfTrips * driverPerTrip;
    }, [numberOfTrips, butawPerTrip]);

    const sumFirstInput = useMemo(() => {
        let sum = 0;
        inputs.forEach((row) => {
            const value = parseInt(row[0]);
            if (!isNaN(value)) {
                sum += value;
            }
        });
        return sum;
    }, [inputs]);

    const concatInput = useMemo(() => {
        const concatInputs = () => {
            return inputs.map((row) => row.join(", ")).join("\n");
        };

        return encodeURIComponent(`
Summary
${concatInputs()}`);
    }, [inputs]);

    const totalRemit = useMemo(() => {
        return totalGross + Number(hulog) - totalDriver - totalButaw - fuelCost - sumFirstInput;
    }, [totalGross, hulog, fuelCost, sumFirstInput, totalButaw, totalDriver]);

    const queryParams = useMemo(() => {
        return `?usp=pp_url&entry.2049482468=${selectedName}&entry.1427149617=${numberOfTrips}&entry.77890937=${totalGross}&entry.315326400=${fuelCost}&entry.323360792=${totalButaw}&entry.230399082=${totalDriver}&entry.1772557068=${sumFirstInput}&entry.859717077=${concatInput}&entry.1952606328=${hulog}&entry.1604827549=A&entry.1188946472=${getCurrentDate()}`;
    }, [numberOfTrips, sumFirstInput, totalButaw, totalGross, totalDriver, fuelCost, hulog, selectedName, concatInput]);


    useEffect(() => {
        if (loadedCount > 0 && iframeRef != null) {
            iframeRef.current.height = '300px'
        }

        if (loadedCount === 0 && iframeRef != null) {
            iframeRef.current.height = '2200px'
        }
    }, [loadedCount])

    useEffect(() => {
        setTimeout(() => scrollToTop(), 1000);
    }, [])

    const addInput = () => {
        setInputs([...inputs, [0, ""]]);
    };

    const handleChange = (e, rowIndex, colIndex) => {
        const values = [...inputs];
        values[rowIndex][colIndex] = e.target.value;
        setInputs(values);
    };

    function countLoaded(event) {
        setLoadedCount(loadedCount + 1);
    }

    function makeHandleChangeEvent(handler) {
        return function (event) {
            handler(event.target.value);
        };
    }

    function handleSubmit(event) {
        event.preventDefault();
        setLoadedCount(0);
        setTimeout(() => smoothScrollToBottom(), 500);
    }

    return (
        <form onSubmit={handleSubmit} className={"px-4"}>
            <h1 className="text-3xl font-bold py-4">Byahe Calculator</h1>
            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className={"text-lg py-5"}>🚌 Details Per Trip</div>
            <div className={"py-4"}>
                Gross Per Trip:
                <input
                    type="number"
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    value={costPerTrip}
                    onChange={makeHandleChangeEvent(setCostPerTrip)}
                />
            </div>
            <div className={"py-4"}>
                Driver Per Trip:
                <input
                    type="number"
                    value={driverPerTrip}
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    onChange={makeHandleChangeEvent(setDriverPerTrip)}
                />
            </div>
            <div className={"py-4"}>
                Butaw Per Trip:
                <input
                    type="number"
                    value={butawPerTrip}
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    onChange={makeHandleChangeEvent(setButawPerTrip)}
                />
            </div>
            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className={"text-lg py-5"}>💸 Details Per Remit</div>

            <div>
                <label>Name</label>
                <select
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    value={selectedName} onChange={makeHandleChangeEvent(setSelectedName)}
                >
                    <option value="">---</option>
                    {['1053', '1725'].map(option => (
                        <option value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className={"py-4"}>
                Number of trips:
                <input
                    type="number"
                    value={numberOfTrips}
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    onChange={makeHandleChangeEvent(setNumberOfTrips)}
                />
            </div>
            <div className={"py-4"}>
                Fuel Cost:
                <input
                    type="number"
                    value={fuelCost}
                    className="form-input ml-4 px-2 py-2 rounded-full w-32"
                    onChange={makeHandleChangeEvent(setFuelCost)}
                />
            </div>
            <div className={"py-4"}>
                <label>
                    Hulog:
                    <input
                        type="number"
                        value={hulog}
                        className="form-input ml-4 px-2 py-2 rounded-full w-32"
                        onChange={makeHandleChangeEvent(setHulog)}
                    />
                </label>
            </div>
            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <div>
                <label className={"font-bold"}>Other Deductions:</label>

                <div>
                    <div>
                        {inputs.map((row, rowIndex) => (
                            <div key={rowIndex} style={{display: "flex", flexWrap: "wrap"}}>
                                {row.map((col, colIndex) => (
                                    <input
                                        className="form-input m-2  px-2 py-2 rounded-full w-32"
                                        key={colIndex}
                                        value={col}
                                        onChange={(e) => handleChange(e, rowIndex, colIndex)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addInput}
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-12"
                        type="button"
                    >
                        Add deductions
                    </button>
                </div>
            </div>
            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <h1 className="text-3xl font-bold py-4">Summary Calculations</h1>
            <div className={"text-lg font-bold"}>🚛 Unit: {selectedName}</div>
            <div className={"text-lg font-bold"}>💸 Gross</div>
            <div className="ml-4 px-2 py-2">Collected Fare: {totalGross}</div>
            <div className="ml-4 px-2 py-2">Hulog: {hulog}</div>
            <div className={"text-lg font-bold"}>👌 Deductions</div>
            <div className="ml-4 px-2 py-2">Driver: {totalDriver}</div>
            <div className="ml-4 px-2 py-2">Butaw: {totalButaw}</div>
            <div className="ml-4 px-2 py-2">Fuel Cost: {fuelCost}</div>
            <div className="ml-4 px-2 py-2">Total Other Cost: {sumFirstInput}</div>
            <div className={"text-3xl font-bold"}>👀 Total Remit: {totalRemit}</div>
            <div className={"py-12 pb-64"}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Confirm
                </button>
            </div>


            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>

            <div>
                <iframe
                    onLoad={countLoaded}
                    ref={iframeRef}
                    src={formLink + queryParams}
                    height="300"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                >
                    Loading…
                </iframe>
            </div>

            <div className={'italic font-bold pb-4 pt-4'}>
                Click SUBMIT once summary is confirmed and
                submit images separately
            </div>

            <button
                onClick={() => (window.location.reload())}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-6 mb-12"
                type="button"
            >
                Refresh
            </button>
        </form>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <OrderForm/>
            </header>
        </div>
    );
}

export default App;
