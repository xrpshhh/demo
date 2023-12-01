"use server"

export async function createAccount() {
    const response = await fetch("http://localhost:3000/api/account", {
        method: "GET"
    });
    return (await response.json())
};

export async function getWallet(formData: FormData) {
    const seed = formData.get("seed")
    
    const response = await fetch("http://localhost:3000/api/getWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed }),
    });
    return (await response.json())
};

// XRPを送金する
export async function transfer(formData: FormData) {
    const seed = formData.get("seed")
    const amount = formData.get("amount");
    const destination = formData.get("destination");

    const response = await fetch("http://localhost:3000/api/sendXRP", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
            seed,
            destination,
            amount,
        }),
    });
    return (await response.json())
}
