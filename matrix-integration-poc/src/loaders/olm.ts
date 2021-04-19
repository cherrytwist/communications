//@ts-ignore
import olmWasmPath from "olm/olm.wasm";
import Olm from "olm";

// with minor modifications from matrix-react-sdk
// using WasmInstantiate fails (magic number inconsistency)

export function loadOlm(): Promise<void> {
  /* Load Olm. We try the WebAssembly version first, and then the legacy,
   * asm.js version if that fails. For this reason we need to wait for this
   * to finish before continuing to load the rest of the app. In future
   * we could somehow pass a promise down to react-sdk and have it wait on
   * that so olm can be loading in parallel with the rest of the app.
   *
   * We also need to tell the Olm js to look for its wasm file at the same
   * level as index.html. It really should be in the same place as the js,
   * ie. in the bundle directory, but as far as I can tell this is
   * completely impossible with webpack. We do, however, use a hashed
   * filename to avoid caching issues.
   */
  return Olm.init({
    locateFile: () => olmWasmPath,
  })
    .then(() => {
      console.log("Using WebAssembly Olm");
    })
    .catch(async (e) => {
      console.log("Failed to load Olm: trying legacy version", e);
      // debugger;
      // const importObject = {
      //   module: {},
      //   env: {
      //     memory: new WebAssembly.Memory({ initial: 256 }),
      //   },
      // };

      // // @ts-ignore
      // const wasmResponse = await fetch(olmWasmPath);
      // const wasmBytes = await wasmResponse.arrayBuffer();
      // const instance = await WebAssembly.instantiate(wasmBytes, importObject);
      // const olm = await WebAssembly.instantiateStreaming(fetch(olmWasmPath), importObject);

      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "olm_legacy.js"; // XXX: This should be cache-busted too
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      })
        .then(() => {
          // Init window.Olm, ie. the one just loaded by the script tag,
          // not 'Olm' which is still the failed wasm version.
          return window.Olm.init();
        })
        .then(() => {
          console.log("Using legacy Olm");
        })
        .catch((e) => {
          console.log("Both WebAssembly and asm.js Olm failed!", e);
        });
    });
}