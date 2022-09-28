import { useNavigate } from "react-router"

export const Help = () => {
    const navigate = useNavigate();
    return(
        <div className="app-wrapper flex gap-5 justify-center flex-col items-center h-[100vh]">
            <div className="app-details mt-10">
                <div className="text-left text-xl font-medium">1. Import goerli test ETH and Oni token to your MetaMask wallet (Owner).</div>
                <div className="text-left text-xl font-medium">2. Send some amount of test ETH and Oni token to main contract address.</div>
                <div className="text-left text-xl font-medium">3. Input hidden contract address as AddLiquidity parameter and Call that function in the main contract (onlyOwner).</div>
                <div className="text-left text-xl font-medium">4. Find Pair address in transaction of AddLiquidity.</div>
                <div className="text-left text-xl font-medium">5. Input main contract address as setContract parameter and call that function in the hidden contract (onlyOwner).</div>
                <div className="text-left text-xl font-medium">6. Call Transfer function in the main contract (Must not onlyOwner).</div>
                    <div className="text-left text-md font-medium ml-10">As the first parameter, input the pair address.</div>
                    <div className="text-left text-md font-medium ml-10">As the second parameter, input the some amount of token.</div>
                <div className="text-left text-xl font-medium">7. And then you can see that the jeetCount variable increase in main & hidden contract.</div>
            </div>
            <button className="app-buttons__login" onClick={() => navigate("/")}  style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: '5px' }}>
                <div>Go Back</div>
            </button>
        </div>
    )
}