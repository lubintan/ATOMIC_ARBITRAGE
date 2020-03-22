module.exports = {
    contracts_build_directory: "./build",
    contracts_directory: "./activeContracts",
    // networks: {
    //     development: {
    //         host: "localhost",
    //         port: 8545,
    //         network_id: "*", // Match any network id
    //         gas: 15000000
    //     }
    // },
    compilers:{
        solc: {
            version: "0.5.10", // A version or constraint - Ex. "^0.5.0"
                            // Can also be set to "native" to use a native solc
            parser: "solcjs",  // Leverages solc-js purely for speedy parsing
        }
    }
};
