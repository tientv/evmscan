import React, {useState, useEffect} from "react";
import ContractReader from "./ContractReader";

import "bootstrap/dist/css/bootstrap.min.css"

function App() {
    const [rpcUrl, setRpcUrl] = useState(localStorage.getItem('rpcUrl') || "");
    const [contractAddress, setContractAddress] = useState(localStorage.getItem('contractAddress') || "");
    const [contractABI, setContractABI] = useState(localStorage.getItem('contractABI') || "");

    useEffect(() => {
        localStorage.setItem('rpcUrl', rpcUrl);
        localStorage.setItem('contractAddress', contractAddress);
        localStorage.setItem('contractABI', contractABI);
    }, [rpcUrl, contractAddress, contractABI]);

    const handleRpcUrlChange = (event) => {
        setRpcUrl(event.target.value);
    };

    const handleContractAddressChange = (event) => {
        setContractAddress(event.target.value);
    };

    const handleContractABIChange = (event) => {
        setContractABI(event.target.value);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12 offset-md-12">
                    <h1 className="text-center mb-4">Contract Interaction</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="rpcUrl">RPC URL:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="rpcUrl"
                                placeholder="Enter RPC URL"
                                value={rpcUrl}
                                onChange={handleRpcUrlChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contractAddress">Contract Address:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="contractAddress"
                                placeholder="Enter Contract Address"
                                value={contractAddress}
                                onChange={handleContractAddressChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contractABI">Contract ABI:</label>
                            <textarea
                                className="form-control"
                                id="contractABI"
                                rows="5"
                                placeholder="Enter Contract ABI"
                                value={contractABI}
                                onChange={handleContractABIChange}
                            />
                        </div>
                    </form>
                    <hr/>
                    {contractABI && rpcUrl && contractAddress && (
                        <ContractReader
                            rpcUrl={rpcUrl}
                            contractAddress={contractAddress}
                            contractABI={JSON.parse(contractABI)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
