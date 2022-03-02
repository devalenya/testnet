// set your API Key
const APIKEY = 'ckey_762e476cd97e4493a3860bd452f';

function getData() {
const address = '0x8aBd03845e9e5424a8dC363062167dF996250327'; // example
const chainId = '97'; // Moonbase Alpha TestNet chain ID
const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);

url.search = new URLSearchParams({
    key: APIKEY
})

// use fetch API to get Covalent data
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
    const result = data.data;

    console.log(result)
    return result
    }
)}

getData();
