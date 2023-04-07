import React, {useState, useEffect} from "react";
import {JsonRpcProvider, Contract} from "ethers";
import {Button, Form, Spinner} from "react-bootstrap";

function ContractReader({rpcUrl, contractAddress, contractABI}) {
    const [functionOutputs, setFunctionOutputs] = useState(() => {
        const savedFunctionOutputs = localStorage.getItem("functionOutputs");
        return savedFunctionOutputs ? JSON.parse(savedFunctionOutputs) : [];
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem(
            "functionOutputs",
            JSON.stringify(functionOutputs, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }, [functionOutputs]);

    const handleCallFunction = async (event, functionName, inputs) => {
        event.preventDefault();
        setIsLoading(true);

        const provider = new JsonRpcProvider(rpcUrl);
        const contract = new Contract(contractAddress, contractABI, provider);

        try {
            const output = await contract[functionName](...inputs);
            setFunctionOutputs((prevOutputs) => [
                ...prevOutputs,
                {functionName, inputs, output},
            ]);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveOutput = (indexToRemove) => {
        setFunctionOutputs((prevOutputs) =>
            prevOutputs.filter((output, index) => index !== indexToRemove)
        );
    };

    const isReadFunction = (entry) => {
        // Check if the function is marked as a view or pure function
        if (entry.stateMutability === "view" || entry.stateMutability === "pure") {
            // Check if the function has at least one output parameter
            if (entry.outputs.length > 0) {
                return true;
            }
        }

        return false;
    };

    const readFunctions = contractABI.filter(
        (entry) => entry.type === "function" && isReadFunction(entry)
    );


    return (
        <div>
            <h2 className="text-center mb-4">Contract Functions</h2>
            <div className="row">
                <div className="col-md-12">
                    <ul className="list-group mb-4">
                        {readFunctions.map((entry, index) => {
                            if (entry.type === "function") {
                                return (
                                    <li className="list-group-item" key={index}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h5>{entry.name}</h5>
                                                <small>
                                                    {entry.inputs
                                                        .map((input) => `${input.type} ${input.name}`)
                                                        .join(", ")}
                                                </small>
                                                <Form
                                                    className="mt-3"
                                                    onSubmit={(event) =>
                                                        handleCallFunction(
                                                            event,
                                                            entry.name,
                                                            entry.inputs.map(
                                                                (_, index) =>
                                                                    event.target[
                                                                        `input-${entry.name}-${index}`
                                                                        ].value
                                                            )
                                                        )
                                                    }
                                                >
                                                    {entry.inputs.map((input, index) => (
                                                        <Form.Group
                                                            key={index}
                                                            className="mb-3"
                                                            controlId={`input-${entry.name}-${index}`}
                                                        >
                                                            <Form.Label>{input.name}</Form.Label>
                                                            <Form.Control type="text"/>
                                                        </Form.Group>
                                                    ))}
                                                    <Button variant="primary" className={"btn-sm"} type="submit"
                                                            disabled={isLoading}>
                                                        {isLoading ? (
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            "Call Function"
                                                        )}
                                                    </Button>
                                                </Form>
                                            </div>
                                        </div>
                                        {functionOutputs
                                            .map((output, idx) => ({...output, idx: idx}))
                                            .filter((output, idx) => output.functionName === entry.name)
                                            .map((output, index) => (
                                                <div key={index} className="row mt-2">
                                                    <div className="col-md-12">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <h5 className="card-title">
                                                                    {output.functionName}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => handleRemoveOutput(output.idx)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </h5>
                                                                <small className="card-text">
                                                                    {output.inputs.join(", ")}
                                                                </small>
                                                                <p className="card-text">
                                                                    {output.output.toString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ContractReader;
