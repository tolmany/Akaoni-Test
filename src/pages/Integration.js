import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Web3 from 'web3';

import { AkaoniABI, AkaoniAddress } from "../contracts/Akaoni"
import { membotABI, membotAddress } from "../contracts/Membot"

function Web3Integration() {
    const [isConnected, setIsConnected] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [swap, setSwap] = useState("");
    const [ctrAddr, setCtrAddr] = useState("");
    const [amount, setAmount] = useState("");
    const [recip, setRecip] = useState("");
    const [jeetCount, setJeetCount] = useState("");
    const [isOwner, setIsOwner] = useState(false);
 
    const navigate = useNavigate();

    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem('userAccount'));
            if (userData != null) {
                setUserInfo(userData);
                setIsConnected(true);
            }
        }
        checkConnectedWallet();
    }, []);

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            // eslint-disable-next-line
            provider = window.web3.currentProvider;
        } else {
            alert(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
        }


        return provider;
    };

    const addLiquidity = async () => {
        if (swap === undefined || swap === "" || swap === null) {
            alert("Input the hidden contract address");
            return;
        }
        const currentProvider = detectCurrentProvider();

        try {
            if (currentProvider) {
                if (currentProvider !== window.ethereum) {
                    alert( 
                        'Non-Ethereum browser detected. You should consider trying MetaMask!'
                    );
                }
                await currentProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currentProvider);
                const AkaOni = await new web3.eth.Contract(AkaoniABI, AkaoniAddress);
                AkaOni.methods.addLiquidity(swap).send({ from: userInfo.account});
            }
        } catch(error){
            alert(error);
        }
    }

    const setContract = async () => {
        if (ctrAddr === undefined || ctrAddr === "" || ctrAddr === null) {
            alert("Input the main contract address");
            return;
        }
        const currentProvider = detectCurrentProvider();


        if (currentProvider) {
            if (currentProvider !== window.ethereum) {
                alert(
                    'Non-Ethereum browser detected. You should consider trying MetaMask!'
                );
            }
            await currentProvider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(currentProvider);
            const Membot = await new web3.eth.Contract(membotABI, membotAddress);
            Membot.methods.setContract(ctrAddr).send({ from: userInfo.account });
        }
    }

    const Transfer = async () => {
        if (recip === undefined || recip === "" || recip === null) {
            alert("Input the pair address");
            return;
        } else if (amount === undefined || amount === "" || amount === null) {
            alert("Input the amount you will send");
            return;
        }
        const currentProvider = detectCurrentProvider();

        if (currentProvider) {
            if (currentProvider !== window.ethereum) {
                alert(
                    'Non-Ethereum browser detected. You should consider trying MetaMask!'
                );
            }
            await currentProvider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(currentProvider);
            
            const Akaoni = await new web3.eth.Contract(AkaoniABI, AkaoniAddress);
            await Akaoni.methods.transfer(recip, amount).send({ from: userInfo.account });
            setJeetCount("Loading JeetCount...");
            const jeetCnt = await Akaoni.methods.getJeetCount().call();
            setJeetCount(jeetCnt);
        }
    }


    const onConnect = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if (currentProvider) {
                if (currentProvider !== window.ethereum) {
                    alert(
                        'Non-Ethereum browser detected. You should consider trying MetaMask!'
                    );
                }

                await currentProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(currentProvider);

                const Akaoni = await new web3.eth.Contract(AkaoniABI, AkaoniAddress);
                const owner = await Akaoni.methods.owner().call();

                const userAccount = await web3.eth.getAccounts();
                const chainId = await web3.eth.getChainId();
                const account = userAccount[0];
                let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
                ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
                saveUserInfo(ethBalance, account, chainId);

                if(account === owner) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }

                if (userAccount.length === 0) {
                    alert('Please connect to meta mask');
                }
            }
        } catch (err) {
            alert(
                'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
            );
        }
    };

    const onDisconnect = () => {
        window.localStorage.removeItem('userAccount');
        setUserInfo({});
        setIsConnected(false);
    };

    const saveUserInfo = (ethBalance, account, chainId) => {
        const userAccount = {
            account: account,
            balance: ethBalance,
            connectionid: chainId,
        };
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        setUserInfo(userData);
        setIsConnected(true);
    };

    // window.ethereum.on('accountsChanged', function(accounts) {
    //     onConnect();
    // })
    useEffect(() => {
        onConnect();
    }, [window.ethereum])

    return (
        <div className="app">
            <div className="app-wrapper ">
                {!isConnected && (
                    <div>
                        <button className="app-buttons__login" onClick={onConnect} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: '5px' }}>
                            <div>Connect to MetaMask</div>
                        </button>
                    </div>
                )}
            </div>
            {isConnected && (
                <div>
                    <div className="app-wrapper flex gap-5">
                        <div className="app-details">
                            <h2>✅ You are connected to metamask.</h2>
                            <div className="app-account">
                                <span>Account number:</span>
                                {userInfo.account}
                            </div>
                            <div className="app-balance">
                                <span>Balance:</span>
                                {userInfo.balance.slice(0, 6)}ETH
                            </div>
                            <div className="app-connectionid">
                                <span>Network ID:</span>
                                {userInfo.connectionid}
                            </div>
                            <div className="app-connectionid">
                                <span>JeetCount:</span>
                                {jeetCount === "" ? 0 : jeetCount}
                            </div>
                            <div className="app-connectionid">
                                <span>IsOwner:</span>
                                {isOwner ? "True" : "False"}
                            </div>
                            <div className="text-base font-medium mt-5">
                                addLiquidity Function:
                            </div>
                            <div className="flex w-full gap-5">
                                <input type="text" id="helper-text" onChange={(e) => setSwap(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 h-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Hidden contract address" />
                                <button type="button" onClick={() => addLiquidity()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Write</button>
                            </div>

                            <div className="text-base font-medium mt-5">
                                SetContract Function:
                            </div>
                            <div className="flex w-full gap-5">
                                <input type="text" id="helper-text" onChange={(e) => setCtrAddr(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 h-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Main contract address" />
                                <button type="button" onClick={() => setContract()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Write</button>
                            </div>

                            <div className="text-base font-medium mt-5">
                                Transfer Function:
                            </div>
                            <div className="flex w-full gap-5">
                                <input type="text" id="helper-text" onChange={(e) => setRecip(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 h-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pair address" />
                                <input type="number" id="helper-text" onChange={(e) => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 h-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Token amount you will send" />
                                <button type="button" onClick={() => Transfer()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Write</button>
                            </div>

                        </div>
                    </div>
                    <div className="flex gap-10 justify-center items-center">
                        <button className="app-buttons__login m-0 mt-5" onClick={() => navigate("/help")}  style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: '5px' }}>
                            <div>Help Me !!!</div>
                        </button>
                        <button className="app-buttons__logout m-0 mt-5" onClick={onDisconnect}>
                            Disconnect
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Web3Integration;