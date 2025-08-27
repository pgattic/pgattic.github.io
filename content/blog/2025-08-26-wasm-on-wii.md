+++
title = "WASM on Wii!"
date = 2025-08-26
template = "blog-page.html"
+++

Over the past year I have been running [a little experiment](https://github.com/pgattic/wasm-experiment) (read my first blog post about it [here](@/blog/2025-03-03-the-wasm-experiment.md)). So far, it has successfully produced a lightweight, cross-platform Fantasy Console similar to the [PICO-8](https://www.lexaloffle.com/pico-8.php) but powered by WebAssembly rather than Lua.

Today, I am pleased to announce that I have successfully ported the engine to the Wii, giving it full feature parity with Linux, the Nintendo DS, and the DSi! The performance is great, and I'll share some things I learned along the way.

![Legendary Console Lineup](/wasm-nds-wii.jpg)
*One game. 4 Systems. No modifications, thanks to the power of WebAssembly!*

## Big-Endian in a Small-Endian World

When I first had the WASM3 library all compiled and imported into my Wii code, I was really excited to see if it would work first try! However, to my confusion, calling platform-side rendering functions directly from the engine worked fine, but calling them from the WASM environment seemed to not work fully. When called from WebAssembly, functions to check if a given button was pressed always returned true, and rectangles wouldn't render. At first it made me feel like there was some bug in WASM3 that I had discovered, when in fact it was because I wasn't taking endianness into account.

The other platforms that I supported up until this point have been little-endian, which led me to unknowingly oversimplify some things. The Wii's CPU has a big-endian PowerPC core, which required some clarifications to the shared code of the engine, especially the WASM binding code. WebAssembly is little-endian and its smallest int size is 32 bits (any smaller value gets padded). Interpreting values from WASM directly as a `uint8_t` or a `bool` in C was subject to the system and WASM using the same byte order. In order to accomodate for this, I had to refactor the WASM glue code so that it always receives values as 32-bit values, and then cast them myself to whatever type they should be, and the compiler handled the rest.

```c
// OLD VERSION
m3ApiRawFunction(api_clearScreen) {
  m3ApiGetArg(uint8_t, color);
  platform_clear_screen(color);
  m3ApiSuccess();
}

// NEW VERSION - note the type cast
m3ApiRawFunction(api_clearScreen) {
  m3ApiGetArg(uint32_t, color32);
  platform_clear_screen((uint8_t)color32);
  m3ApiSuccess();
}
```

## More VRAM Limitations

Video memory limits are a problem I encountered on the Nintendo DS already, and I was able to solve it without too much hassle. It boils down to the fact that I am manually converting and storing textures to memory myself, since the official graphics spec I chose for the engine is the GameBoy Advance's paletted 4bpp bit arrangement with a 16-color palette. I converted all 256 8x8px tiles in to a column that is 8x2048 pixels. However, GRRLIB's maximum size for a texture is somewhere between 1024 and 2048, so I had some nasty graphics corruption. I refactored the Wii-specific code to instead use a graphic that is 256x256 pixels, and that fixed it.

## Other Improvements

Another huge milestone reached was that the engine now has a unified file select and game menu screen, with the ability to add more screens and menus much easier in the future! This required a lot of code refactoring, and a lot of time just thinking about how to organize things better. All the work has paid off nicely, and I am proud of the results!

![Unified File Select Screen](/unified-file-select.jpg)

Since the previous blog post about this project, I made its repository public! Give it some love by starring it on [GitHub](https://github.com/pgattic/wasm-experiment)!

