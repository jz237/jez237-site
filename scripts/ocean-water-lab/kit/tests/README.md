# Checks

**FFT against a direct CPU sum** (needs Node, `npm i playwright`, and Chrome or Chromium; set `CHROME` to its path if Playwright cannot find one). Prints the largest error per cascade, which should be about 1e-3 m or less, and the measured against expected RMS wave height:

    node fft_check.mjs

**C++ analytic sea against the JavaScript reference.** The last lines should show differences near 1e-13:

    g++ -std=c++11 -O2 -o crosscheck crosscheck.cpp && ./crosscheck | node crosscheck.js

**HLSL type check** with clang's HLSL front end. No output means it passed. `hlsl_shim.h` stands in for clang's own `hlsl.h` and declares only the intrinsics and texture types the kit uses:

    mkdir -p shim && cp hlsl_shim.h shim/hlsl.h
    clang -x hlsl --target=dxil-pc-shadermodel6.3-library -I shim -DWATER_LOOP= -fsyntax-only -Wno-dxil-validation check.hlsl
    clang -x hlsl --target=dxil-pc-shadermodel6.3-library -I shim -DWATER_LOOP= -fsyntax-only -Wno-dxil-validation check_fft.hlsl

`-DWATER_LOOP=` removes the `[loop]` attribute, which clang 18 does not parse yet. FXC and DXC do.
