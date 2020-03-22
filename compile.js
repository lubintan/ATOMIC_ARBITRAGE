const solcjs = require('solc');


const compile = async function() {
    // v0.5.10+commit.5a6ea5b1
    // .Emscripten.clang


    const version = 'soljson-v0.5.10+commit.5a6ea5b1.js';
    const compiler = await solcjs.loadRemoteVersion(version);
    // const select = await compiler.version();

    console.log(compiler);
    
        // const { releases, nightly, all } = select;
        // for (each of releases){
        //     console.log(each);
        // }
    }

compile();