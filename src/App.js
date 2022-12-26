import "./App.css";
import React, {useMemo, useState, useRef} from "react";

const PRICE_PER_ITEM = 10;


function OrderForm() {
    const [name, setName] = useState("");
    const [cost, setCost] = useState(0);
    const [costPerTrip, setCostPerTrip] = useState(1440);
    const [driverPerTrip, setDriverPerTrip] = useState(200);
    const [butawPerTrip, setButawPerTrip] = useState(120);
    const [numberOfTrips, setNumberOfTrips] = useState(0);
    const [fuelCost, setFuelCost] = useState(0);
    const [hulog, setHulog] = useState(0);
    // Declare a state variable called "inputs" with an initial value of an empty array
    const [inputs, setInputs] = useState([[0, ""]]);
    const refIframe = useRef(null);

    const formLink = `https://docs.google.com/forms/d/e/1FAIpQLSeXCGnAO2376A0D7oRqs7VzOWFLAmOr8UUbdne4M4pnW0jkAQ/viewform`

    const totalButaw = useMemo(() => {
        return numberOfTrips * butawPerTrip
    }, [numberOfTrips, butawPerTrip])

    const totalGross = useMemo(() => {
        return numberOfTrips * costPerTrip
    }, [numberOfTrips, butawPerTrip])

    const totalDriver = useMemo(() => {
        return numberOfTrips * driverPerTrip
    }, [numberOfTrips, butawPerTrip])

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

    const queryParams = useMemo(() => {
        return `?usp=pp_url&entry.2049482468=Roy&entry.1427149617=${numberOfTrips}&entry.77890937=${totalGross}&entry.315326400=890&entry.323360792=${totalButaw}&entry.230399082=${totalDriver}&entry.1772557068=${sumFirstInput}&entry.859717077=asd`
    }, [cost, numberOfTrips, sumFirstInput, totalButaw, totalGross, totalDriver])

    const addInput = () => {
        setInputs([...inputs, [0, ""]]);
    };

    const handleChange = (e, rowIndex, colIndex) => {
        const values = [...inputs];
        values[rowIndex][colIndex] = e.target.value;
        setInputs(values);
    };

    function makeHandleChangeEvent(handler) {
        return function (event) {
            handler(event.target.value);
        };
    }

    function handleSubmit(event) {
        event.preventDefault();
        setCost(numberOfTrips * PRICE_PER_ITEM);
        if (refIframe) {
            console.log(refIframe, refIframe.current.contentWindow.document.body.querySelector('form'));
            // refIframe.current.querySelector('form').submit();
        }
    }


    return (
        <form onSubmit={handleSubmit} className={"px-4"}>
            <h1 className="text-3xl font-bold py-4">Byahe Calculator</h1>

            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>

            <div className={"text-lg py-5"}>🚌 Numbers Per Trip</div>

            <div className={"py-4"}>
                Gross Per Trip:
                <input
                    type="number"
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    value={costPerTrip}
                    onChange={makeHandleChangeEvent(setCostPerTrip)}
                />
            </div>

            <div className={"py-4"}>
                Driver Per Trip:
                <input
                    type="number"
                    value={driverPerTrip}
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    onChange={makeHandleChangeEvent(setDriverPerTrip)}
                />
            </div>

            <div className={"py-4"}>
                Butaw Per Trip:
                <input
                    type="number"
                    value={butawPerTrip}
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    onChange={makeHandleChangeEvent(setButawPerTrip)}
                />
            </div>

            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>

            <div className={"text-lg py-5"}>💸 Numbers Per Day</div>

            <div className={'py-4'}>
                Name:
                <input
                    type="text"
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    value={name}
                    onChange={makeHandleChangeEvent(setName)}
                />
            </div>

            <div className={"py-4"}>
                Number of trips:
                <input
                    type="number"
                    value={numberOfTrips}
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    onChange={makeHandleChangeEvent(setNumberOfTrips)}
                />
            </div>

            <div className={"py-4"}>
                Fuel Cost:
                <input
                    type="number"
                    value={fuelCost}
                    className="form-input ml-4 px-2 py-2 rounded-full"
                    onChange={makeHandleChangeEvent(setFuelCost)}
                />
            </div>

            <div className={"py-4"}>
                <label>
                    Hulog:
                    <input
                        type="number"
                        value={hulog}
                        className="form-input ml-4 px-2 py-2 rounded-full"
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
                                        className="form-input m-2  px-2 py-2 rounded-full"
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
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-12"
                    >
                        Add
                    </button>
                </div>
            </div>

            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"/>

            <h1 className="text-3xl font-bold py-4">Summary Calculations</h1>

            <div className={"text-lg font-bold"}>💸 Gross</div>
            <div className="ml-4 px-2 py-2">
                Collected Fare: {totalGross}
            </div>

            <div className={"text-lg font-bold"}>👌 Deductions</div>

            <div className="ml-4 px-2 py-2">Driver: {totalDriver}</div>

            <div className="ml-4 px-2 py-2">Butaw: {totalButaw}</div>

            <div className="ml-4 px-2 py-2">Fuel Cost: {fuelCost}</div>

            <div className="ml-4 px-2 py-2">Total Other Cost: {sumFirstInput}</div>

            <div className={"text-3xl font-bold"}>👀 Total Remit: {cost}</div>

            <div className={"py-12"}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Enter
                </button>
            </div>


            <div>
                <iframe
                    src={formLink + queryParams}
                    width="640" height="1352" frameBorder="0" marginHeight="0" marginWidth="0">Loading…
                </iframe>
            </div>


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
